var vm = new Vue({
    el: '#app',
    data: {
       // 声明商品列表（数组）
        productList: [],
        //  声明总价格
        totalMoney: 0
    },
    //  过滤器（格式化数据）
    filters: {
        //  格式化单价金额
        formatMoney:function (val){
            // 格式化两位小数点
            return "￥"+val.toFixed(2);
        }
    },
    //  钩子函数
    mounted: function (){
        //  直接vm无法调用，因为mounted钩子函数替换。
        this.$nextTick(function (){
            // 代码保证 this.$el 在 document 中
            vm.cartView();
        });
    },
    methods: {
        //  商品
        cartView: function (){
            //  定义this(vm)
            var _this = this;
            //  使用vue-resource插件
            // 使用data.json文件(注意这里的this作用域已变化，这里的this=全局vm)
            this.$http.get("data/cartData.json",{"id": 123 }).then(function (res){
                //  商品列表接口赋值，从json中保存到productList(面向对象封装原因，使用断点:res.data.result.list)；
                _this.productList = res.data.result.list;

                //  总价格接口赋值
                _this.totalMoney = res.data.result.totalMoney;
            });
        },
        //  价格改变，拿到两个值item 和 1；
        changeMoney: function (product, way){
        //   判断way 进行加减 >0:加，<0:减
            if (way>0){
                // 数量自加
                product.productQuantity++;
            }else {
                product.productQuantity--;
                // 商品最小值=1
                if (product.productQuantity < 1){
                    product.productQuantity = 1;
                }
            }
        }
    }
})
// 全局格式化总价格
Vue.filter('money', function (val, type){
    return "￥" + val + type;
});