export enum Routes {
    REGISTER = "/register",
    LOGIN = "/login",
    ME = "/me",
    VENDOR_REGISTER = "/vendor-register",
    RESET_PASSWORD = "/reset-password",
    FORGOT_PASSWORD = "/forgot-password",
    REFRESH_TOKEN = "/refresh-token",
    FILE_UPLOAD = "/file-upload",
    CREATE_VENDOR = "/create-vendor",
    CREATE_VENDOR_REGION = "/create-vendor-region",
    CREATE_BUYER = "/create-buyer",
    CREATE_BUYER_SITE = "/create-buyersite",
    CREATE_DEALER = "/create-dealer",
    CREATE_DEALER_SITE = "/create-dealersite",
    CREATE_VDS_RELATION = "/vds-relations",
    CREATE_VDSBS_RELATION = "/vdsbs-relations",
    VENDOR = "/vendor",
}

export enum PrivateRoutes {
    VendorRoutes = "/vendors/",
    VendorRegionRoutes = "/vendor-regions/",
    DealerRoutes = "/dealer/",
    DealerSiteRoutes = "/dealer-site/",
    BuyerRoutes = "/buyer/",
    BuyerSiteRoutes = "/buyer-site/",
    SiteAdminRoutes = "/site-admin/",
}
