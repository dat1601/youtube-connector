// https://developers.google.com/datastudio/connector/reference#getauthtype
const getAuthType = () => {
    const cc = DataStudioApp.createCommunityConnector();
    const AuthTypes = cc.AuthType;
    return cc.newAuthTypeResponse().setAuthType(AuthTypes.NONE).build();
};
