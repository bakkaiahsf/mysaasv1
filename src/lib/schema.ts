import { pgTable, text, timestamp, boolean, json, integer, decimal, index } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified"),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// =====================================================
// RELATIONSHIP MAPPING EXTENSIONS (NEW FUNCTIONALITY)
// =====================================================

// Company cache for enhanced data and relationship analysis
export const companyProfiles = pgTable("company_profiles", {
  id: text("id").primaryKey(),
  companyNumber: text("company_number").notNull().unique(),
  companyName: text("company_name").notNull(),
  companyStatus: text("company_status").notNull(),
  companyType: text("company_type").notNull(),
  incorporationDate: timestamp("incorporation_date"),
  dissolvedDate: timestamp("dissolved_date"),
  registeredAddress: json("registered_address"),
  sicCodes: json("sic_codes"),
  
  // Enhanced analysis fields
  riskScore: integer("risk_score"),
  complianceScore: integer("compliance_score"),
  lastAnalyzed: timestamp("last_analyzed"),
  
  // Raw Companies House data cache
  rawData: json("raw_data"),
  officersData: json("officers_data"),
  filingHistoryData: json("filing_history_data"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  companyNumberIdx: index("company_number_idx").on(table.companyNumber),
  companyNameIdx: index("company_name_idx").on(table.companyName),
  statusIdx: index("company_status_idx").on(table.companyStatus),
}));

// Directors and their cross-company relationships
export const directors = pgTable("directors", {
  id: text("id").primaryKey(),
  
  // Director identification
  name: text("name").notNull(),
  title: text("title"),
  dateOfBirth: text("date_of_birth"), // Anonymized (month/year only)
  nationality: text("nationality"),
  occupation: text("occupation"),
  
  // Address information (for network analysis)
  addressLine1: text("address_line_1"),
  addressLine2: text("address_line_2"),
  locality: text("locality"),
  postalCode: text("postal_code"),
  country: text("country"),
  
  // Risk and compliance scoring
  riskFlags: json("risk_flags"),
  totalAppointments: integer("total_appointments").default(0),
  activeAppointments: integer("active_appointments").default(0),
  disqualifications: json("disqualifications"),
  
  // Metadata
  firstSeen: timestamp("first_seen").notNull().defaultNow(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
}, (table) => ({
  nameIdx: index("director_name_idx").on(table.name),
  postalCodeIdx: index("director_postal_code_idx").on(table.postalCode),
}));

// Director appointments (many-to-many relationship)
export const directorAppointments = pgTable("director_appointments", {
  id: text("id").primaryKey(),
  directorId: text("director_id").notNull().references(() => directors.id, { onDelete: "cascade" }),
  companyNumber: text("company_number").notNull(),
  
  // Appointment details
  officerRole: text("officer_role").notNull(),
  appointedOn: timestamp("appointed_on"),
  resignedOn: timestamp("resigned_on"),
  
  // Status and metadata
  appointmentStatus: text("appointment_status").notNull(),
  responsibilityLevel: text("responsibility_level"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  directorCompanyIdx: index("director_company_idx").on(table.directorId, table.companyNumber),
  companyIdx: index("appointment_company_idx").on(table.companyNumber),
  statusIdx: index("appointment_status_idx").on(table.appointmentStatus),
}));

// Shareholder and ownership structure
export const shareholders = pgTable("shareholders", {
  id: text("id").primaryKey(),
  
  // Shareholder identification  
  name: text("name").notNull(),
  shareholderType: text("shareholder_type").notNull(), // individual, corporate, trust, etc.
  
  // For corporate shareholders
  companyNumber: text("company_number"),
  
  // For individual shareholders (anonymized)
  nationality: text("nationality"),
  
  // Metadata
  firstSeen: timestamp("first_seen").notNull().defaultNow(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
}, (table) => ({
  nameIdx: index("shareholder_name_idx").on(table.name),
  typeIdx: index("shareholder_type_idx").on(table.shareholderType),
}));

// Ownership relationships
export const ownershipStructure = pgTable("ownership_structure", {
  id: text("id").primaryKey(),
  shareholderId: text("shareholder_id").notNull().references(() => shareholders.id, { onDelete: "cascade" }),
  companyNumber: text("company_number").notNull(),
  
  // Ownership details
  shareClass: text("share_class"),
  sharesHeld: text("shares_held"),
  percentageHeld: decimal("percentage_held", { precision: 5, scale: 2 }),
  votingRights: decimal("voting_rights", { precision: 5, scale: 2 }),
  
  // Beneficial ownership
  isBeneficialOwner: boolean("is_beneficial_owner").default(false),
  beneficialOwnershipChain: json("beneficial_ownership_chain"),
  
  // Dates
  ownershipDate: timestamp("ownership_date"),
  notifiedDate: timestamp("notified_date"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  shareholderCompanyIdx: index("shareholder_company_idx").on(table.shareholderId, table.companyNumber),
  companyIdx: index("ownership_company_idx").on(table.companyNumber),
  beneficialIdx: index("beneficial_owner_idx").on(table.isBeneficialOwner),
}));

// Business relationships and networks
export const businessRelationships = pgTable("business_relationships", {
  id: text("id").primaryKey(),
  
  // Relationship participants
  entityType1: text("entity_type_1").notNull(), // company, director, shareholder
  entityId1: text("entity_id_1").notNull(),
  entityType2: text("entity_type_2").notNull(),
  entityId2: text("entity_id_2").notNull(),
  
  // Relationship details
  relationshipType: text("relationship_type").notNull(), // director_of, shareholder_of, subsidiary_of, etc.
  relationshipStrength: decimal("relationship_strength", { precision: 3, scale: 2 }), // 0.0 to 1.0
  
  // Network analysis metrics
  connectionDegree: integer("connection_degree").default(1),
  pathLength: integer("path_length").default(1),
  clusteringCoefficient: decimal("clustering_coefficient", { precision: 4, scale: 3 }),
  
  // Temporal data
  relationshipStart: timestamp("relationship_start"),
  relationshipEnd: timestamp("relationship_end"),
  isActive: boolean("is_active").default(true),
  
  // Risk scoring
  riskFlag: boolean("risk_flag").default(false),
  riskReason: text("risk_reason"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  entity1Idx: index("entity1_idx").on(table.entityType1, table.entityId1),
  entity2Idx: index("entity2_idx").on(table.entityType2, table.entityId2),
  relationshipTypeIdx: index("relationship_type_idx").on(table.relationshipType),
  activeRelationshipsIdx: index("active_relationships_idx").on(table.isActive),
  riskFlagIdx: index("risk_flag_idx").on(table.riskFlag),
}));

// Address analysis and geographic clustering
export const addressClusters = pgTable("address_clusters", {
  id: text("id").primaryKey(),
  
  // Address components
  addressLine1: text("address_line_1").notNull(),
  addressLine2: text("address_line_2"),
  locality: text("locality").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),
  
  // Standardized/geocoded data
  standardizedAddress: text("standardized_address"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  
  // Cluster analysis
  clusterId: text("cluster_id"),
  clusterSize: integer("cluster_size").default(1),
  
  // Associated entities count
  companiesCount: integer("companies_count").default(0),
  directorsCount: integer("directors_count").default(0),
  
  // Risk indicators
  riskScore: integer("risk_score").default(0),
  suspiciousActivityFlags: json("suspicious_activity_flags"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  postalCodeIdx: index("postal_code_idx").on(table.postalCode),
  clusterIdx: index("cluster_id_idx").on(table.clusterId),
  locationIdx: index("location_idx").on(table.latitude, table.longitude),
}));

// Network analysis cache for performance
export const networkAnalysisCache = pgTable("network_analysis_cache", {
  id: text("id").primaryKey(),
  
  // Cache key components
  entityType: text("entity_type").notNull(), // company, director, etc.
  entityId: text("entity_id").notNull(),
  analysisType: text("analysis_type").notNull(), // connections, ownership_chain, risk_network, etc.
  
  // Analysis parameters
  depth: integer("depth").default(2),
  relationshipTypes: json("relationship_types"),
  filters: json("filters"),
  
  // Cached results
  networkData: json("network_data"),
  metrics: json("metrics"),
  visualization: json("visualization"),
  
  // Cache metadata
  computeTime: integer("compute_time"), // milliseconds
  nodeCount: integer("node_count"),
  edgeCount: integer("edge_count"),
  
  // Cache management
  accessCount: integer("access_count").default(0),
  lastAccessed: timestamp("last_accessed").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  entityAnalysisIdx: index("entity_analysis_idx").on(table.entityType, table.entityId, table.analysisType),
  expiresIdx: index("expires_at_idx").on(table.expiresAt),
  lastAccessedIdx: index("last_accessed_idx").on(table.lastAccessed),
}));

// User activity and audit trail for compliance
export const userActivity = pgTable("user_activity", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  
  // Activity details
  activityType: text("activity_type").notNull(), // search, view_company, view_network, export_data, etc.
  entityType: text("entity_type"), // company, director, network
  entityId: text("entity_id"),
  
  // GDPR and compliance
  dataAccessed: json("data_accessed"),
  legalBasis: text("legal_basis"), // legitimate_interest, consent, etc.
  purpose: text("purpose"),
  
  // Technical details
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  sessionId: text("session_id"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  userActivityIdx: index("user_activity_idx").on(table.userId, table.activityType),
  entityIdx: index("activity_entity_idx").on(table.entityType, table.entityId),
  createdAtIdx: index("activity_created_at_idx").on(table.createdAt),
}));
