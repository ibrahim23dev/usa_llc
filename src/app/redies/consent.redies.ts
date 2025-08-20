export enum ENUM_REDIS_SUBSCRIBE {
  socket_message = "socket_message",
  socket_user = "socket_user",
  TEST = "TEST",
}

export enum ENUM_REDIS_KEY {
  socket_user = "socket:user:",
  RIS_token = "redis:userid:token:",
  RIS_ModuleService = "redis:module:",
  RIS_TipsAndGuideline = "redis:TipsAndGuideline:",
  RIS_Ooptestmodual = "redis:Ooptestmodual:",
  RIS_RoutingReminder = "redis:RoutingReminder:",
  RIS_RoleBaseUserId = "redis:RoleBaseUserId:",
  socket_id_in_token = "socket:id:token:",
  REDIS_IN_SAVE_FRIENDSHIP = "redis:friendShip:",
  REDIS_IN_SAVE_ALL_DATA = "redis:allData:",
  REDIS_IN_SAVE_GroupMemberAndUserId = "redis:GroupMemberAndUserId:", //redis:userIdToFriendShip:user_id:groupmember_id
  REDIS_IN_SAVE_ALL_TEXT_FIELDS = "redis:alltextfields:",
  REDIS_IN_SAVE_ALL_USERS = "redis:users:",
  REDIS_IN_SAVE_OTHER_DATA = "redis:otherDate:",
  /* *
  'redis:All:Categories' --> this is to gat all category
  'redis:All:Categories:{categoryType}' to get separate category
  */
  RIS_All_Categories = "redis:All:Categories:", //redis:Categories:67110262be5233078d7bff3a
  RIS_All_ProductsCategories = "redis:All:ProductsCategories", //redis:Categories:67110262be5233078d7bff3a
  RIS_User_Save_Product = "redis:userSaveProduct:", //
  RIS_Product = "redis:product:",
  RIS_senderId_receiverId = "redis:userIdToFriendShip:", //redis:userIdToFriendShip:sfd44sd:sdfsd4
  RIS_Testimonials = "redis:Testimonials:", //
  RIS_Groups = "redis:Groups:",
  RIS_AddToCart = "redis:AddToCart:", //redis:AddToCart:userId:productId
  RIS_UserName = "redis:user:UserName:", //redis:user:userId:UserName:sampod1122
  RIS_Servicemodule = "redis:Servicemodule:", //
  RIS_Role = "redis:Role:", //
  RIS_UserPermission = "redis:UserPermission:", //
  RIS_ModulePermission = "redis:ModulePermission:", //
  RIS_DepositRequest = "redis:DepositRequest:", //
  RIS_LedgerSystem = "redis:LedgerSystem:", //
  RIS_Wallet = "redis:Wallet:", //
  RIS_TransactionsLogs = "redis:TransactionsLogs:", //
  RIS_Expenses = "redis:Expenses:", //
  RIS_UserAllPermission = "redis:UserAllPermission:", //
  RISAdminService_BankAccount = "redis:AdminService:BankAccount:", //
  RISAdminService_Bank = "redis:AdminService:Bank:", //
}
export const subscribeArray = [
  ENUM_REDIS_SUBSCRIBE.socket_message,
  ENUM_REDIS_SUBSCRIBE.socket_user,
  ENUM_REDIS_SUBSCRIBE.TEST,
];
