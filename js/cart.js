var vm = new Vue({
    el: '#app',
    data: {
       // 声明商品列表（数组）
        productList: [],
        //  声明总价格
        totalMoney: 0
    },
    filters: {

    },
    mounted: function (){
        this.cartView();
    },
    methods: {
        cartView: function (){
            //  定义this
            var _this = this;
            //  使用vue-resource插件
            // 使用data.json文件(注意这里的this作用域已变化)
            this.$http.get("data/cartData.json",{"id": 123 }).then(function (res){
                //  商品列表接口赋值，从json中保存到productList(面向对象封装原因，使用断点:res.data.result.list)；
                _this.productList = res.data.result.list;

                //  总价格接口赋值
                _this.totalMoney = res.data.result.totalMoney;
            });
        }
    }
})