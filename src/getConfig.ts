const getConfig = () => {
    const cc = DataStudioApp.createCommunityConnector();
    const config = cc.getConfig();
    return config.build();
};
