
export default {
    created() {
        this.feature = this.$getFeature();
        console.log('当前路由权限api：', this.feature);
    }
};
