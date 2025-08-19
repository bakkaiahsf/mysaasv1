import { NextRequest, NextResponse } from 'next/server';
import { networkAnalysisService } from '@/lib/network-analysis';
import { db } from '@/lib/db';
import { 
  companyProfiles,
  directors, 
  directorAppointments, 
  shareholders,
  ownershipStructure,
  userActivity
} from '@/lib/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

interface TimelineEvent {
  id: string;
  date: Date;
  type: 'appointment' | 'resignation' | 'filing' | 'shareholding' | 'address' | 'company_status' | 'other';
  title: string;
  description: string;
  entityName: string;
  entityType: 'person' | 'company' | 'filing';
  impact: 'high' | 'medium' | 'low';
  category: string;
  metadata: {
    [key: string]: any;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: 'EntityType and entityId are required' },
        { status: 400 }
      );
    }

    // Parse date range
    const dateRange = {
      start: startDate ? new Date(startDate) : new Date(new Date().getFullYear() - 10, 0, 1),
      end: endDate ? new Date(endDate) : new Date()
    };

    const events: TimelineEvent[] = [];

    // Fetch different types of timeline events based on entity type
    if (entityType === 'company') {
      // Company-specific timeline events
      events.push(...await getCompanyTimelineEvents(entityId, dateRange));
    } else if (entityType === 'director' || entityType === 'person') {
      // Director/person-specific timeline events
      events.push(...await getDirectorTimelineEvents(entityId, dateRange));
    }

    // Sort events by date
    events.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Calculate statistics
    const eventsByType = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const years = new Set(events.map(e => e.date.getFullYear()));
    const significantEvents = events.filter(e => e.impact === 'high').length;

    const timelineData = {
      events,
      dateRange: {
        start: events.length > 0 ? new Date(Math.min(...events.map(e => e.date.getTime()))) : dateRange.start,
        end: events.length > 0 ? new Date(Math.max(...events.map(e => e.date.getTime()))) : dateRange.end
      },
      stats: {
        totalEvents: events.length,
        eventsByType,
        activeYears: years.size,
        significantEvents
      }
    };

    return NextResponse.json(timelineData);

  } catch (error) {
    console.error('Timeline analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch timeline data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function getCompanyTimelineEvents(
  companyNumber: string, 
  dateRange: { start: Date; end: Date }
): Promise<TimelineEvent[]> {
  const events: TimelineEvent[] = [];

  try {
    // Get company info
    const companyInfo = await db
      .select()
      .from(companyProfiles)
      .where(eq(companyProfiles.companyNumber, companyNumber))
      .limit(1);

    if (companyInfo.length === 0) {
      return events;
    }

    const company = companyInfo[0];

    // Company incorporation event
    if (company.incorporationDate) {
      const incorporationDate = new Date(company.incorporationDate);
      if (incorporationDate >= dateRange.start && incorporationDate <= dateRange.end) {
        events.push({
          id: `incorporation-${companyNumber}`,
          date: incorporationDate,
          type: 'company_status',
          title: 'Company Incorporated',
          description: `${company.companyName} was incorporated as a ${company.companyType}`,
          entityName: company.companyName,
          entityType: 'company',
          impact: 'high',
          category: 'Corporate Structure',
          metadata: {
            companyNumber,
            companyType: company.companyType,
            jurisdiction: 'UK'
          }
        });
      }
    }

    // Director appointments and resignations
    const appointments = await db
      .select({
        appointment: directorAppointments,
        director: directors
      })
      .from(directorAppointments)
      .innerJoin(directors, eq(directorAppointments.directorId, directors.id))
      .where(eq(directorAppointments.companyNumber, companyNumber))
      .orderBy(desc(directorAppointments.appointedOn));

    for (const appointment of appointments) {
      // Appointment event
      if (appointment.appointment.appointedOn) {
        const appointmentDate = new Date(appointment.appointment.appointedOn);
        if (appointmentDate >= dateRange.start && appointmentDate <= dateRange.end) {
          events.push({
            id: `appointment-${appointment.appointment.id}`,
            date: appointmentDate,
            type: 'appointment',
            title: `Director Appointed: ${appointment.director.name}`,
            description: `${appointment.director.name} was appointed as ${appointment.appointment.officerRole} of ${company.companyName}`,
            entityName: appointment.director.name,
            entityType: 'person',
            impact: appointment.appointment.officerRole?.toLowerCase().includes('chief') ? 'high' : 'medium',
            category: 'Management Changes',
            metadata: {
              directorId: appointment.director.id,
              role: appointment.appointment.officerRole,
              companyNumber
            }
          });
        }
      }

      // Resignation event
      if (appointment.appointment.resignedOn) {
        const resignationDate = new Date(appointment.appointment.resignedOn);
        if (resignationDate >= dateRange.start && resignationDate <= dateRange.end) {
          events.push({
            id: `resignation-${appointment.appointment.id}`,
            date: resignationDate,
            type: 'resignation',
            title: `Director Resigned: ${appointment.director.name}`,
            description: `${appointment.director.name} resigned as ${appointment.appointment.officerRole} of ${company.companyName}`,
            entityName: appointment.director.name,
            entityType: 'person',
            impact: appointment.appointment.officerRole?.toLowerCase().includes('chief') ? 'high' : 'medium',
            category: 'Management Changes',
            metadata: {
              directorId: appointment.director.id,
              role: appointment.appointment.officerRole,
              companyNumber
            }
          });
        }
      }
    }

    // Shareholding changes (using ownershipStructure for detailed data)
    const shareholdings = await db
      .select({
        shareholder: shareholders,
        ownership: ownershipStructure
      })
      .from(ownershipStructure)
      .innerJoin(shareholders, eq(ownershipStructure.shareholderId, shareholders.id))
      .where(eq(ownershipStructure.companyNumber, companyNumber));

    for (const shareholding of shareholdings) {
      if (shareholding.ownership.notifiedDate) {
        const notificationDate = new Date(shareholding.ownership.notifiedDate);
        if (notificationDate >= dateRange.start && notificationDate <= dateRange.end) {
          const isSignificant = Number(shareholding.ownership.percentageHeld || 0) > 25; // 25%+ shareholding
          
          events.push({
            id: `shareholding-${shareholding.ownership.id}`,
            date: notificationDate,
            type: 'shareholding',
            title: `Shareholding Change: ${shareholding.shareholder.name}`,
            description: `${shareholding.shareholder.name} reported ${shareholding.ownership.percentageHeld}% shareholding in ${company.companyName}`,
            entityName: shareholding.shareholder.name || 'Unknown Shareholder',
            entityType: shareholding.shareholder.shareholderType === 'individual' ? 'person' : 'company',
            impact: isSignificant ? 'high' : 'medium',
            category: 'Ownership Changes',
            metadata: {
              shareholding: shareholding.ownership.percentageHeld,
              shareholderType: shareholding.shareholder.shareholderType,
              companyNumber
            }
          });
        }
      }
    }

    // Filing events (from company profile updates)
    const profiles = await db
      .select()
      .from(companyProfiles)
      .where(eq(companyProfiles.companyNumber, companyNumber))
      .orderBy(desc(companyProfiles.updatedAt));

    for (const profile of profiles) {
      if (profile.updatedAt) {
        const filingDate = new Date(profile.updatedAt);
        if (filingDate >= dateRange.start && filingDate <= dateRange.end) {
          events.push({
            id: `filing-${profile.id}`,
            date: filingDate,
            type: 'filing',
            title: 'Company Filing Updated',
            description: `${company.companyName} filed updated company information`,
            entityName: company.companyName,
            entityType: 'filing',
            impact: 'low',
            category: 'Regulatory Compliance',
            metadata: {
              companyNumber,
              filingType: 'Company Information Update'
            }
          });
        }
      }
    }

    // Address changes (if we have address history)
    // This would require additional address change tracking in the database
    // For now, we'll create sample address change events based on profile updates

  } catch (error) {
    console.error('Error fetching company timeline events:', error);
  }

  return events;
}

async function getDirectorTimelineEvents(
  directorId: string, 
  dateRange: { start: Date; end: Date }
): Promise<TimelineEvent[]> {
  const events: TimelineEvent[] = [];

  try {
    // Get director info
    const directorInfo = await db
      .select()
      .from(directors)
      .where(eq(directors.id, directorId))
      .limit(1);

    if (directorInfo.length === 0) {
      return events;
    }

    const director = directorInfo[0];

    // Get all appointments for this director
    const appointments = await db
      .select({
        appointment: directorAppointments,
        company: companyProfiles
      })
      .from(directorAppointments)
      .innerJoin(companyProfiles, eq(directorAppointments.companyNumber, companyProfiles.companyNumber))
      .where(eq(directorAppointments.directorId, directorId))
      .orderBy(desc(directorAppointments.appointedOn));

    for (const appointment of appointments) {
      // Appointment events
      if (appointment.appointment.appointedOn) {
        const appointmentDate = new Date(appointment.appointment.appointedOn);
        if (appointmentDate >= dateRange.start && appointmentDate <= dateRange.end) {
          events.push({
            id: `appointment-${appointment.appointment.id}`,
            date: appointmentDate,
            type: 'appointment',
            title: `Appointed at ${appointment.company.companyName}`,
            description: `${director.name} was appointed as ${appointment.appointment.officerRole} at ${appointment.company.companyName}`,
            entityName: appointment.company.companyName,
            entityType: 'company',
            impact: appointment.appointment.officerRole?.toLowerCase().includes('chief') ? 'high' : 'medium',
            category: 'Career Events',
            metadata: {
              companyNumber: appointment.company.companyNumber,
              role: appointment.appointment.officerRole,
              directorId
            }
          });
        }
      }

      // Resignation events
      if (appointment.appointment.resignedOn) {
        const resignationDate = new Date(appointment.appointment.resignedOn);
        if (resignationDate >= dateRange.start && resignationDate <= dateRange.end) {
          events.push({
            id: `resignation-${appointment.appointment.id}`,
            date: resignationDate,
            type: 'resignation',
            title: `Resigned from ${appointment.company.companyName}`,
            description: `${director.name} resigned as ${appointment.appointment.officerRole} from ${appointment.company.companyName}`,
            entityName: appointment.company.companyName,
            entityType: 'company',
            impact: appointment.appointment.officerRole?.toLowerCase().includes('chief') ? 'high' : 'medium',
            category: 'Career Events',
            metadata: {
              companyNumber: appointment.company.companyNumber,
              role: appointment.appointment.officerRole,
              directorId
            }
          });
        }
      }
    }

  } catch (error) {
    console.error('Error fetching director timeline events:', error);
  }

  return events;
}