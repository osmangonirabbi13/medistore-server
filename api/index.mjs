var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import { toNodeHandler } from "better-auth/node";
import express from "express";

// src/Seller/seller.routes.ts
import { Router } from "express";

// src/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id            String  @id\n  name          String\n  email         String  @unique\n  emailVerified Boolean @default(false)\n  image         String?\n\n  role     Role    @default(CUSTOMER)\n  isBanned Boolean @default(false)\n  phone    String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  sessions Session[]\n  accounts Account[]\n\n  // domain relations\n  sellerProfile      SellerProfile?\n  medicines          Medicine[]     @relation("SellerMedicines")\n  orders             Order[]        @relation("CustomerOrders")\n  reviews            Review[]       @relation("CustomerReviews")\n  cart               Cart?\n  orderItemsAsSeller OrderItem[]    @relation("SellerOrderItems")\n\n  approvedSellers SellerProfile[] @relation("SellerApprovedBy")\n\n  @@index([role])\n  @@index([isBanned])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String   @unique\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id         String @id\n  accountId  String\n  providerId String\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([providerId, accountId])\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Cart {\n  id String @id @default(cuid())\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  items     CartItem[]\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n}\n\nmodel CartItem {\n  id String @id @default(cuid())\n\n  cartId String\n  cart   Cart   @relation(fields: [cartId], references: [id], onDelete: Cascade)\n\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id], onDelete: Restrict)\n\n  quantity   Int     @default(1)\n  isSelected Boolean @default(true)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([cartId, medicineId])\n  @@index([medicineId])\n  @@index([cartId, isSelected])\n}\n\nmodel Category {\n  id          String  @id @default(cuid())\n  name        String  @unique\n  description String?\n  isActive    Boolean @default(true)\n\n  medicines Medicine[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([isActive])\n}\n\nmodel Medicine {\n  id String @id @default(cuid())\n\n  sellerId String\n  seller   User   @relation("SellerMedicines", fields: [sellerId], references: [id], onDelete: Restrict)\n\n  categoryId String\n  category   Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)\n\n  name         String\n  manufacturer String?\n  description  String?\n  otcNote      String?\n\n  price Decimal @db.Decimal(10, 2)\n  stock Int     @default(0)\n\n  imageUrl String?\n  isActive Boolean @default(true)\n\n  cartItems  CartItem[]\n  orderItems OrderItem[]\n  reviews    Review[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([sellerId])\n  @@index([categoryId])\n  @@index([isActive])\n  @@index([price])\n  @@index([manufacturer])\n}\n\nenum Role {\n  CUSTOMER\n  SELLER\n  ADMIN\n}\n\nenum SellerRequestStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum OrderStatus {\n  PLACED\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nenum PaymentMethod {\n  COD\n}\n\nmodel Order {\n  id String @id @default(cuid())\n\n  customerId String\n  customer   User   @relation("CustomerOrders", fields: [customerId], references: [id], onDelete: Restrict)\n\n  status        OrderStatus   @default(PLACED)\n  paymentMethod PaymentMethod @default(COD)\n\n  subtotal    Decimal @db.Decimal(10, 2)\n  shippingFee Decimal @default(0.00) @db.Decimal(10, 2)\n  total       Decimal @db.Decimal(10, 2)\n\n  shippingName         String\n  shippingPhone        String\n  shippingAddressLine1 String\n  shippingAddressLine2 String?\n  shippingCity         String\n  shippingPostalCode   String?\n  shippingCountry      String  @default("Bangladesh")\n\n  placedAt  DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  items   OrderItem[]\n  reviews Review[]\n\n  @@index([customerId])\n  @@index([status])\n  @@index([placedAt])\n}\n\nmodel OrderItem {\n  id String @id @default(cuid())\n\n  orderId String\n  order   Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)\n\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id], onDelete: Restrict)\n\n  sellerId String\n  seller   User   @relation("SellerOrderItems", fields: [sellerId], references: [id], onDelete: Restrict)\n\n  status OrderStatus @default(PLACED)\n\n  medicineName String\n  imageUrl     String?\n  unitPrice    Decimal @db.Decimal(10, 2)\n\n  quantity  Int\n  lineTotal Decimal @db.Decimal(10, 2)\n\n  @@index([orderId])\n  @@index([medicineId])\n  @@index([sellerId])\n  @@index([status])\n}\n\nmodel Review {\n  id String @id @default(cuid())\n\n  customerId String\n  customer   User   @relation("CustomerReviews", fields: [customerId], references: [id], onDelete: Restrict)\n\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n\n  orderId String\n  order   Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)\n\n  rating  Int\n  comment String?\n\n  createdAt DateTime @default(now())\n\n  @@unique([customerId, orderId, medicineId])\n  @@index([medicineId])\n  @@index([customerId])\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel SellerProfile {\n  id     String @id @default(cuid())\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  pharmacyName  String\n  licenseNumber String?\n  address       String?\n  status        SellerRequestStatus @default(PENDING)\n  approvedAt    DateTime?\n\n  approvedById String?\n  approvedBy   User?   @relation("SellerApprovedBy", fields: [approvedById], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([status])\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"isBanned","kind":"scalar","type":"Boolean"},{"name":"phone","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"sellerProfile","kind":"object","type":"SellerProfile","relationName":"SellerProfileToUser"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"SellerMedicines"},{"name":"orders","kind":"object","type":"Order","relationName":"CustomerOrders"},{"name":"reviews","kind":"object","type":"Review","relationName":"CustomerReviews"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToUser"},{"name":"orderItemsAsSeller","kind":"object","type":"OrderItem","relationName":"SellerOrderItems"},{"name":"approvedSellers","kind":"object","type":"SellerProfile","relationName":"SellerApprovedBy"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CartToUser"},{"name":"items","kind":"object","type":"CartItem","relationName":"CartToCartItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"CartItemToMedicine"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"isSelected","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"seller","kind":"object","type":"User","relationName":"SellerMedicines"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"name","kind":"scalar","type":"String"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"otcNote","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToMedicine"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MedicineToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"MedicineToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerOrders"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod"},{"name":"subtotal","kind":"scalar","type":"Decimal"},{"name":"shippingFee","kind":"scalar","type":"Decimal"},{"name":"total","kind":"scalar","type":"Decimal"},{"name":"shippingName","kind":"scalar","type":"String"},{"name":"shippingPhone","kind":"scalar","type":"String"},{"name":"shippingAddressLine1","kind":"scalar","type":"String"},{"name":"shippingAddressLine2","kind":"scalar","type":"String"},{"name":"shippingCity","kind":"scalar","type":"String"},{"name":"shippingPostalCode","kind":"scalar","type":"String"},{"name":"shippingCountry","kind":"scalar","type":"String"},{"name":"placedAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"OrderToReview"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToOrderItem"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"seller","kind":"object","type":"User","relationName":"SellerOrderItems"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"medicineName","kind":"scalar","type":"String"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"unitPrice","kind":"scalar","type":"Decimal"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"lineTotal","kind":"scalar","type":"Decimal"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerReviews"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToReview"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToReview"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"SellerProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SellerProfileToUser"},{"name":"pharmacyName","kind":"scalar","type":"String"},{"name":"licenseNumber","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"SellerRequestStatus"},{"name":"approvedAt","kind":"scalar","type":"DateTime"},{"name":"approvedById","kind":"scalar","type":"String"},{"name":"approvedBy","kind":"object","type":"User","relationName":"SellerApprovedBy"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CartItemScalarFieldEnum: () => CartItemScalarFieldEnum,
  CartScalarFieldEnum: () => CartScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  MedicineScalarFieldEnum: () => MedicineScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  OrderItemScalarFieldEnum: () => OrderItemScalarFieldEnum,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SellerProfileScalarFieldEnum: () => SellerProfileScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Cart: "Cart",
  CartItem: "CartItem",
  Category: "Category",
  Medicine: "Medicine",
  Order: "Order",
  OrderItem: "OrderItem",
  Review: "Review",
  SellerProfile: "SellerProfile"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  role: "role",
  isBanned: "isBanned",
  phone: "phone",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CartScalarFieldEnum = {
  id: "id",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CartItemScalarFieldEnum = {
  id: "id",
  cartId: "cartId",
  medicineId: "medicineId",
  quantity: "quantity",
  isSelected: "isSelected",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MedicineScalarFieldEnum = {
  id: "id",
  sellerId: "sellerId",
  categoryId: "categoryId",
  name: "name",
  manufacturer: "manufacturer",
  description: "description",
  otcNote: "otcNote",
  price: "price",
  stock: "stock",
  imageUrl: "imageUrl",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  status: "status",
  paymentMethod: "paymentMethod",
  subtotal: "subtotal",
  shippingFee: "shippingFee",
  total: "total",
  shippingName: "shippingName",
  shippingPhone: "shippingPhone",
  shippingAddressLine1: "shippingAddressLine1",
  shippingAddressLine2: "shippingAddressLine2",
  shippingCity: "shippingCity",
  shippingPostalCode: "shippingPostalCode",
  shippingCountry: "shippingCountry",
  placedAt: "placedAt",
  updatedAt: "updatedAt"
};
var OrderItemScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  medicineId: "medicineId",
  sellerId: "sellerId",
  status: "status",
  medicineName: "medicineName",
  imageUrl: "imageUrl",
  unitPrice: "unitPrice",
  quantity: "quantity",
  lineTotal: "lineTotal"
};
var ReviewScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  medicineId: "medicineId",
  orderId: "orderId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt"
};
var SellerProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  pharmacyName: "pharmacyName",
  licenseNumber: "licenseNumber",
  address: "address",
  status: "status",
  approvedAt: "approvedAt",
  approvedById: "approvedById",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/Seller/seller.service.ts
var createSeller = async (userId, pharmacyName) => {
  console.log(userId);
  return await prisma.sellerProfile.upsert({
    where: { userId },
    update: { pharmacyName },
    create: {
      userId,
      pharmacyName
    }
  });
};
var createMedicine = async (data, userId) => {
  if (!userId) {
    throw new Error("Unauthorized: userId missing");
  }
  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId },
    select: { id: true, status: true }
  });
  console.log(sellerProfile);
  if (!sellerProfile) {
    throw new Error("Seller profile not found. Please become a seller first.");
  }
  const result = await prisma.medicine.create({
    data: {
      ...data,
      sellerId: userId
    }
  });
  console.log(result);
  return result;
};
var updateMedicine = async (medicineId, userId, payload) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
    select: { id: true, sellerId: true }
  });
  if (!medicine) {
    throw new Error("Medicine not found");
  }
  if (medicine.sellerId !== userId) {
    throw new Error("Forbidden! You cannot update this medicine.");
  }
  const { id, sellerId, createdAt, updatedAt, ...safeData } = payload;
  const result = await prisma.medicine.update({
    where: { id: medicineId },
    data: safeData
  });
  return result;
};
var deleteMedicine = async (medicineId, userId) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
    select: { id: true, sellerId: true }
  });
  if (!medicine) {
    throw new Error("Medicine not found");
  }
  if (medicine.sellerId !== userId) {
    throw new Error("Forbidden! You cannot delete this medicine.");
  }
  const result = await prisma.medicine.delete({
    where: { id: medicineId }
  });
  return result;
};
var getSellerOrders = async (sellerId) => {
  const items = await prisma.orderItem.findMany({
    where: { sellerId },
    include: {
      order: true
    },
    orderBy: {
      order: { placedAt: "desc" }
    }
  });
  return items;
};
var updateSellerOrderStatus = async (sellerId, orderItemId, status) => {
  const item = await prisma.orderItem.findUnique({
    where: { id: orderItemId }
  });
  if (!item) throw new Error("Order item not found");
  if (item.sellerId !== sellerId) throw new Error("Forbidden");
  const updated = await prisma.orderItem.update({
    where: { id: orderItemId },
    data: { status }
  });
  return updated;
};
var approveSeller = async (sellerUserId, adminId) => {
  return prisma.sellerProfile.update({
    where: { userId: sellerUserId },
    data: {
      status: "APPROVED",
      approvedById: adminId,
      approvedAt: /* @__PURE__ */ new Date()
    }
  });
};
var ServiceController = {
  createMedicine,
  createSeller,
  updateMedicine,
  deleteMedicine,
  getSellerOrders,
  updateSellerOrderStatus,
  approveSeller
};

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASS
  }
});
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [process.env.APP_URL],
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "CUSTOMER"
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Medi Store" <osmangoniyou12@gmail.com>',
          to: user.email,
          subject: "Please verify your email!",
          html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .header {
      background-color: #0f172a;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 22px;
    }

    .content {
      padding: 30px;
      color: #334155;
      line-height: 1.6;
    }

    .content h2 {
      margin-top: 0;
      font-size: 20px;
      color: #0f172a;
    }

    .button-wrapper {
      text-align: center;
      margin: 30px 0;
    }

    .verify-button {
      background-color: #2563eb;
      color: #ffffff !important;
      padding: 14px 28px;
      text-decoration: none;
      font-weight: bold;
      border-radius: 6px;
      display: inline-block;
    }

    .verify-button:hover {
      background-color: #1d4ed8;
    }

    .footer {
      background-color: #f1f5f9;
      padding: 20px;
      text-align: center;
      font-size: 13px;
      color: #64748b;
    }

    .link {
      word-break: break-all;
      font-size: 13px;
      color: #2563eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>Medi Store</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <h2>Verify Your Email Address</h2>
      <p>
        Hello ${user.name} <br /><br />
        Thank you for registering on <strong>Medi Store</strong>.
        Please confirm your email address to activate your account.
      </p>

      <div class="button-wrapper">
        <a href="${verificationUrl}" class="verify-button">
          Verify Email
        </a>
      </div>

      <p>
        If the button doesn\u2019t work, copy and paste the link below into your browser:
      </p>

      <p class="link">
        ${url}
      </p>

      <p>
        This verification link will expire soon for security reasons.
        If you did not create an account, you can safely ignore this email.
      </p>

      <p>
        Regards, <br />
        <strong>Medi Store Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      \xA9 2025 Medi Store. All rights reserved.
    </div>
  </div>
</body>
</html>
`
        });
        console.log("Message sent:", info.messageId);
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  }
});

// src/middlewares/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!"
        });
      }
      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email verification required."
        });
      }
      const user = await prisma.user.findUnique({
        where: { id: session.user.id }
      });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found!"
        });
      }
      if (user.isBanned) {
        return res.status(403).json({
          success: false,
          message: "Your account has been banned!"
        });
      }
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified
      };
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You don't have permission."
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
var auth_default = auth2;

// src/Seller/seller.controller.ts
var createSeller2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const { pharmacyName } = req.body;
    if (!pharmacyName || pharmacyName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "pharmacyName is required"
      });
    }
    const data = await ServiceController.createSeller(
      userId,
      pharmacyName.trim()
    );
    return res.status(201).json({
      success: true,
      message: "Seller profile created successfully",
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error?.message
    });
  }
};
var createMedicine2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    const data = await ServiceController.createMedicine(req.body, userId);
    console.log(data);
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
var updateMedicine2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const { id } = req.params;
    const data = await ServiceController.updateMedicine(id, userId, req.body);
    return res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      data
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Medicine update failed"
    });
  }
};
var deleteMedicine2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const { id } = req.params;
    const data = await ServiceController.deleteMedicine(id, userId);
    return res.status(200).json({
      success: true,
      message: "Medicine delete successfully",
      data
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: err.message || "Medicine Delete failed"
    });
  }
};
var getSellerOrders2 = async (req, res) => {
  try {
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const data = await ServiceController.getSellerOrders(sellerId);
    return res.status(200).json({
      success: true,
      message: "Seller orders fetched",
      data
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to fetch seller orders"
    });
  }
};
var updateSellerOrderStatus2 = async (req, res) => {
  try {
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }
    const updated = await ServiceController.updateSellerOrderStatus(
      sellerId,
      id,
      status
    );
    return res.status(200).json({
      success: true,
      message: "Order status updated",
      data: updated
    });
  } catch (err) {
    const msg = err.message || "Failed to update";
    const statusCode = msg === "Order item not found" ? 404 : msg === "Forbidden" ? 403 : 400;
    return res.status(statusCode).json({
      success: false,
      message: msg
    });
  }
};
var approveSeller2 = async (req, res) => {
  try {
    const adminId = req.user?.id;
    if (!adminId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (req.user?.role !== "ADMIN" /* ADMIN */) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ success: false, message: "userId is required" });
    const data = await ServiceController.approveSeller(userId, adminId);
    return res.json({
      success: true,
      message: "Seller approved successfully",
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error?.message
    });
  }
};
var SellerController = {
  createMedicine: createMedicine2,
  createSeller: createSeller2,
  updateMedicine: updateMedicine2,
  deleteMedicine: deleteMedicine2,
  getSellerOrders: getSellerOrders2,
  updateSellerOrderStatus: updateSellerOrderStatus2,
  approveSeller: approveSeller2
};

// src/Seller/seller.routes.ts
var router = Router();
router.get("/orders", auth_default("SELLER"), SellerController.getSellerOrders);
router.patch("/orders/:id", auth_default("SELLER"), SellerController.updateSellerOrderStatus);
router.post("/become-seller", auth_default(), SellerController.createSeller);
router.get("/admin/sellers", auth_default(), SellerController.approveSeller);
router.post("/medicines", auth_default("SELLER"), SellerController.createMedicine);
router.put("/medicines/:id", auth_default("SELLER"), SellerController.updateMedicine);
router.delete("/medicines/:id", auth_default("SELLER"), SellerController.deleteMedicine);
var sellerRouter = router;

// src/app.ts
import cors from "cors";

// src/Category/category.routes.ts
import { Router as Router2 } from "express";

// src/Category/category.service.ts
var createCategory = async (payload) => {
  const name = payload.name?.trim();
  if (!name) throw new Error("Category name is required");
  const exists = await prisma.category.findUnique({ where: { name } });
  if (exists) throw new Error("Category name already exists");
  return await prisma.category.create({
    data: {
      name,
      description: payload.description?.trim() || null
    }
  });
};
var getAllCategory = async () => {
  return await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" }
  });
};
var CategoryService = {
  createCategory,
  getAllCategory
};

// src/Category/category.controller.ts
var createCategory2 = async (req, res) => {
  try {
    const data = await CategoryService.createCategory(req.body);
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
var getAllCategory2 = async (req, res) => {
  try {
    const data = await CategoryService.getAllCategory();
    return res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
var CategoryController = {
  createCategory: createCategory2,
  getAllCategory: getAllCategory2
};

// src/Category/category.routes.ts
var router2 = Router2();
router2.post("/add-category", auth_default("SELLER"), CategoryController.createCategory);
router2.get("/", CategoryController.getAllCategory);
var categoryRouter = router2;

// src/Product/product.routes.ts
import { Router as Router3 } from "express";

// src/Product/product.service.ts
var getAllMedicine = async ({
  search,
  page,
  limit,
  skip,
  sortBy,
  sortOrder
}) => {
  const andConditions = [];
  if (search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          manufacturer: {
            contains: search,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  const allowedSortFields = ["stock", "price", "categoryId", "isActive"];
  const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const medicines = await prisma.medicine.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions
    },
    orderBy: {
      [finalSortBy]: sortOrder === "asc" ? "asc" : "desc"
    },
    include: {
      category: true,
      seller: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
  const total = await prisma.medicine.count({
    where: {
      AND: andConditions
    }
  });
  return {
    data: medicines,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getMedicineById = async (id) => {
  if (!id) throw new Error("Medicine id is required");
  const medicine = await prisma.medicine.findUnique({
    where: { id },
    include: {
      category: true,
      seller: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  if (!medicine) throw new Error("Medicine not found");
  return medicine;
};
var getMyMedicine = async (sellerId) => {
  console.log(sellerId);
  await prisma.user.findUniqueOrThrow({
    where: {
      id: sellerId,
      isBanned: false
    },
    select: {
      id: true
    }
  });
  const result = await prisma.medicine.findMany({
    where: {
      sellerId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const total = await prisma.medicine.aggregate({
    _count: {
      id: true
    },
    where: {
      sellerId
    }
  });
  return {
    data: result,
    total
  };
};
var ProductService = {
  getMedicineById,
  getAllMedicine,
  getMyMedicine
};

// src/helpers/paginationSortingHelper.ts
var paginationSortingHelper = (options) => {
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.max(1, Number(options.limit) || 12);
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder === "asc" ? "asc" : "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};
var paginationSortingHelper_default = paginationSortingHelper;

// src/Product/product.controller.ts
var getAllMedicine2 = async (req, res) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : void 0;
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper_default(
      req.query
    );
    const result = await ProductService.getAllMedicine({
      search: searchString,
      page,
      limit,
      skip,
      sortBy,
      sortOrder
    });
    return res.status(200).json({
      success: true,
      message: "Medicines retrieved successfully",
      data: result.data,
      pagination: result.pagination
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: "Failed to retrieve medicines",
      error: e.message
    });
  }
};
var getMedicineById2 = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await ProductService.getMedicineById(id);
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};
var getMyMedicine2 = async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    if (!user) {
      throw new Error("You are unauthorized !");
    }
    const result = await ProductService.getMyMedicine(user.id);
    res.status(200).json({
      success: true,
      result
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      details: err
    });
  }
};
var ProductController = {
  getMedicineById: getMedicineById2,
  getAllMedicine: getAllMedicine2,
  getMyMedicine: getMyMedicine2
};

// src/Product/product.routes.ts
var router3 = Router3();
router3.get("/", ProductController.getAllMedicine);
router3.get("/my-medicine", auth_default("SELLER"), ProductController.getMyMedicine);
router3.get("/:id", ProductController.getMedicineById);
var productRoute = router3;

// src/order/order.routes.ts
import { Router as Router4 } from "express";

// src/order/order.service.ts
var getMyCart = async (userId) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { medicine: true }
      }
    }
  });
  return cart;
};
var addToCart = async (userId, medicineId, quantity = 1) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
    select: { id: true, isActive: true }
  });
  if (!medicine || !medicine.isActive) {
    throw new Error("Medicine not found or not available");
  }
  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId }
  });
  const item = await prisma.cartItem.upsert({
    where: {
      cartId_medicineId: { cartId: cart.id, medicineId }
    },
    update: {
      quantity: { increment: quantity }
    },
    create: {
      cartId: cart.id,
      medicineId,
      quantity
    },
    include: { medicine: true }
  });
  return item;
};
var updateQuantity = async (userId, cartItemId, action) => {
  if (action !== "inc" && action !== "dec") {
    throw new Error("Invalid action. Use 'inc' or 'dec'.");
  }
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true }
  });
  if (!cartItem) {
    throw new Error("Cart item not found");
  }
  if (cartItem.cart.userId !== userId) {
    throw new Error("Forbidden");
  }
  const newQty = action === "inc" ? cartItem.quantity + 1 : cartItem.quantity - 1;
  if (newQty < 1) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
    return { removed: true, item: null };
  }
  const updated = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity: newQty },
    include: { medicine: true }
  });
  return { removed: false, item: updated };
};
var checkoutFromCart = async (userId, payload) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: { include: { medicine: true } }
    }
  });
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }
  let subtotal = new prismaNamespace_exports.Decimal(0);
  const orderItems = cart.items.map((ci) => {
    const m = ci.medicine;
    if (!m.isActive) throw new Error(`${m.name} is not available`);
    if (m.stock < ci.quantity) throw new Error(`${m.name} out of stock`);
    const unitPrice = m.price;
    const lineTotal = unitPrice.mul(ci.quantity);
    subtotal = subtotal.add(lineTotal);
    return {
      medicineId: m.id,
      sellerId: m.sellerId,
      quantity: ci.quantity,
      unitPrice,
      lineTotal,
      medicineName: m.name,
      imageUrl: m.imageUrl ?? null
    };
  });
  const shippingFee = new prismaNamespace_exports.Decimal(0);
  const total = subtotal.add(shippingFee);
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        customerId: userId,
        status: "PLACED",
        paymentMethod: payload.paymentMethod ?? "COD",
        subtotal,
        shippingFee,
        total,
        shippingName: payload.shippingName,
        shippingPhone: payload.shippingPhone,
        shippingAddressLine1: payload.shippingAddressLine1,
        shippingAddressLine2: payload.shippingAddressLine2 ?? null,
        shippingCity: payload.shippingCity,
        shippingPostalCode: payload.shippingPostalCode ?? null,
        shippingCountry: payload.shippingCountry ?? "Bangladesh",
        items: { create: orderItems }
      },
      include: { items: true }
    });
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    return created;
  });
  return order;
};
var getOrderDetails = async (userId, orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          medicine: true
        }
      }
    }
  });
  if (!order) throw new Error("Order not found");
  if (order.customerId !== userId) throw new Error("Forbidden");
  return order;
};
var removeFromCart = async (userId, medicineId) => {
  const cart = await prisma.cart.findUnique({
    where: { userId }
  });
  if (!cart) {
    throw new Error("Cart not found");
  }
  const item = await prisma.cartItem.findUnique({
    where: {
      cartId_medicineId: { cartId: cart.id, medicineId }
    }
  });
  if (!item) {
    throw new Error("Item not found in cart");
  }
  await prisma.cartItem.delete({
    where: {
      cartId_medicineId: { cartId: cart.id, medicineId }
    }
  });
  return item;
};
var getMyOrders = async (userId) => {
  const orders = await prisma.order.findMany({
    where: { customerId: userId },
    orderBy: { placedAt: "desc" },
    include: { items: true }
  });
  return orders;
};
var orderService = {
  getMyCart,
  addToCart,
  updateQuantity,
  checkoutFromCart,
  getOrderDetails,
  removeFromCart,
  getMyOrders
};

// src/order/order.controller.ts
var getMyCart2 = async (req, res) => {
  const userId = req.user?.id;
  if (!userId)
    return res.status(401).json({ success: false, message: "Unauthorized" });
  const result = await orderService.getMyCart(userId);
  return res.status(200).json({
    success: true,
    message: "Cart fetched successfully",
    data: result
  });
};
var addToCart2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { medicineId, quantity = 1 } = req.body;
    if (!medicineId) {
      return res.status(400).json({ success: false, message: "medicineId is required" });
    }
    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty < 1) {
      return res.status(400).json({ success: false, message: "quantity must be >= 1" });
    }
    const item = await orderService.addToCart(userId, medicineId, qty);
    return res.status(201).json({
      success: true,
      message: "Added to cart",
      data: item
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Add to cart failed"
    });
  }
};
var updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { id } = req.params;
    const { action } = req.body;
    if (action !== "inc" && action !== "dec") {
      return res.status(400).json({
        success: false,
        message: "action must be 'inc' or 'dec'"
      });
    }
    const result = await orderService.updateQuantity(
      userId,
      id,
      action
    );
    if (result.removed) {
      return res.status(200).json({
        success: true,
        message: "Item removed",
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: "Quantity updated",
      data: result.item
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: err.message
    });
  }
};
var checkout = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const payload = req.body;
    if (!payload.shippingName || !payload.shippingPhone || !payload.shippingAddressLine1 || !payload.shippingCity) {
      return res.status(400).json({
        success: false,
        message: "Shipping info required (name, phone, address, city)."
      });
    }
    const order = await orderService.checkoutFromCart(userId, payload);
    return res.status(201).json({
      success: true,
      message: "Checkout success",
      data: order
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Checkout failed"
    });
  }
};
var getOrderDetails2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { id } = req.params;
    const order = await orderService.getOrderDetails(userId, id);
    return res.status(200).json({
      success: true,
      message: "Order details fetched",
      data: order
    });
  } catch (err) {
    const msg = err.message || "Failed to fetch order details";
    const status = msg === "Order not found" ? 404 : msg === "Forbidden" ? 403 : 400;
    return res.status(status).json({ success: false, message: msg });
  }
};
var removeFromCart2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { medicineId } = req.body;
    if (!medicineId) {
      return res.status(400).json({ success: false, message: "medicineId is required" });
    }
    const item = await orderService.removeFromCart(userId, medicineId);
    return res.status(200).json({
      success: true,
      message: "Removed from cart",
      data: item
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Remove from cart failed"
    });
  }
};
var getMyOrders2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const orders = await orderService.getMyOrders(userId);
    return res.status(200).json({
      success: true,
      message: "Orders fetched",
      data: orders
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to fetch orders"
    });
  }
};
var orderController = {
  getMyCart: getMyCart2,
  addToCart: addToCart2,
  updateCartQuantity,
  checkout,
  getOrderDetails: getOrderDetails2,
  removeFromCart: removeFromCart2,
  getMyOrders: getMyOrders2
};

// src/order/order.routes.ts
var router4 = Router4();
router4.get("/cart", auth_default("CUSTOMER"), orderController.getMyCart);
router4.post("/", auth_default(), orderController.addToCart);
router4.patch("/:id", auth_default("CUSTOMER"), orderController.updateCartQuantity);
router4.post("/checkout", auth_default("CUSTOMER"), orderController.checkout);
router4.get("/my-orders", auth_default(), orderController.getMyOrders);
router4.get("/:id", auth_default(), orderController.getOrderDetails);
router4.delete("/:id", auth_default(), orderController.removeFromCart);
var orderRouter = router4;

// src/admin/admin.routes.ts
import { Router as Router5 } from "express";

// src/admin/admin.service.ts
var getAllUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: false,
      createdAt: true
    }
  });
  return users;
};
var updateUserStatus = async (userId, isBanned) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) throw new Error("User not found");
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isBanned }
  });
  return updated;
};
var getStats = async () => {
  const [
    totalUsers,
    bannedUsers,
    totalOrders,
    totalMedicines,
    totalCategories,
    salesAgg,
    recentOrders
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isBanned: true } }),
    prisma.order.count(),
    prisma.medicine.count(),
    prisma.category.count(),
    prisma.order.aggregate({
      _sum: { total: true }
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { placedAt: "desc" },
      select: {
        id: true,
        customerId: true,
        status: true,
        total: true,
        placedAt: true
      }
    })
  ]);
  const totalSales = salesAgg._sum.total ?? 0;
  return {
    totalUsers,
    bannedUsers,
    activeUsers: totalUsers - bannedUsers,
    totalOrders,
    totalMedicines,
    totalCategories,
    totalSales,
    recentOrders
  };
};
var getOrderDetails3 = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      customer: {
        select: { id: true, name: true, email: true }
      },
      items: true
    }
  });
  if (!order) throw new Error("Order not found");
  return order;
};
var getAllOrders = async (query) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper_default(query);
  const where = {};
  if (query.status) {
    where.status = query.status;
  }
  if (query.search) {
    where.OR = [
      { id: { contains: query.search, mode: "insensitive" } },
      { shippingName: { contains: query.search, mode: "insensitive" } },
      { shippingPhone: { contains: query.search, mode: "insensitive" } }
    ];
  }
  const allowedSortFields = ["placedAt", "updatedAt", "total", "status"];
  const finalSortBy = sortBy && allowedSortFields.includes(String(sortBy)) ? String(sortBy) : "placedAt";
  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [finalSortBy]: sortOrder },
      include: {
        customer: {
          select: { id: true, name: true, email: true }
        }
      }
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    data: orders
  };
};
var adminService = {
  getAllUsers,
  updateUserStatus,
  getStats,
  getOrderDetails: getOrderDetails3,
  getAllOrders
};

// src/admin/admin.controller.ts
var getAllUsers2 = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to fetch users"
    });
  }
};
var updateUserBanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBanned } = req.body;
    if (typeof isBanned !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isBanned must be true or false"
      });
    }
    const updated = await adminService.updateUserStatus(id, isBanned);
    return res.status(200).json({
      success: true,
      message: "User ban status updated",
      data: updated
    });
  } catch (err) {
    const msg = err.message || "Failed to update user";
    const code = msg === "User not found" ? 404 : 400;
    return res.status(code).json({
      success: false,
      message: msg
    });
  }
};
var getAdminStats = async (req, res) => {
  try {
    const data = await adminService.getStats();
    return res.status(200).json({
      success: true,
      message: "Admin stats fetched",
      data
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to fetch stats"
    });
  }
};
var getOrderDetails4 = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await adminService.getOrderDetails(id);
    return res.status(200).json({
      success: true,
      message: "Order details fetched",
      data: order
    });
  } catch (err) {
    const msg = err.message || "Failed to fetch order details";
    const code = msg === "Order not found" ? 404 : 400;
    return res.status(code).json({
      success: false,
      message: msg
    });
  }
};
var getAllOrders2 = async (req, res) => {
  try {
    const result = await adminService.getAllOrders(req.query);
    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      ...result
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to fetch orders"
    });
  }
};
var adminController = {
  getAllUsers: getAllUsers2,
  updateUserBanStatus,
  getAdminStats,
  getOrderDetails: getOrderDetails4,
  getAllOrders: getAllOrders2
};

// src/admin/admin.routes.ts
var router5 = Router5();
router5.get("/users", adminController.getAllUsers);
router5.get("/stats", adminController.getAdminStats);
router5.get("/orders", adminController.getAllOrders);
router5.get("/orders/:id", adminController.getOrderDetails);
router5.patch("/users/:id", auth_default("ADMIN"), adminController.updateUserBanStatus);
var adminRoute = router5;

// src/profile/profile.route.ts
import { Router as Router6 } from "express";

// src/profile/profile.service.ts
var getMe = async (userId) => {
  console.log(userId);
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true
    }
  });
};
var updateMe = async (userId, payload) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      ...payload.name !== void 0 ? { name: payload.name } : {},
      ...payload.phone !== void 0 ? { phone: payload.phone } : {}
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      emailVerified: true,
      updatedAt: true
    }
  });
};
var profileService = {
  getMe,
  updateMe
};

// src/profile/profile.controller.ts
var getMyProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    console.log(userId);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    const data = await profileService.getMe(userId);
    if (!data)
      return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error?.message
    });
  }
};
var updateMyProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    const { name, phone } = req.body;
    if (name !== void 0 && name.trim().length === 0) {
      return res.status(400).json({ success: false, message: "name cannot be empty" });
    }
    const data = await profileService.updateMe(userId, {
      name: name?.trim(),
      phone: phone?.trim()
    });
    return res.json({ success: true, message: "Profile updated", data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error?.message
    });
  }
};
var profileController = {
  getMyProfile,
  updateMyProfile
};

// src/profile/profile.route.ts
var router6 = Router6();
router6.get("/me", auth_default("ADMIN", "CUSTOMER", "SELLER"), profileController.getMyProfile);
router6.patch("me", auth_default("ADMIN", "CUSTOMER", "SELLER"), profileController.updateMyProfile);
var profileRouter = router6;

// src/app.ts
var app = express();
app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
app.use("/api/profile", profileRouter);
app.use("/api/admin", adminRoute);
app.use("/api/medicines", productRoute);
app.use("/api/seller", sellerRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);
app.get("/", (req, res) => {
  res.send("hello world");
});
var app_default = app;

// src/index.ts
var PORT = process.env.PORT;
async function main() {
  try {
    await prisma.$connect();
    console.log("Connectd to the database successfully");
    app_default.listen(PORT, () => {
      console.log(`server is running on ${PORT}`);
    });
  } catch (error) {
    console.error("An error occureed", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
var index_default = app_default;
export {
  index_default as default
};
