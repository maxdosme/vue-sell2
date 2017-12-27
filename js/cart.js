var vm = new Vue({
    el: '#app',
    data: {
       // 声明商品列表（数组）
        productList: [],
        //  声明总价格
        totalMoney: 0,
        //  全选
        checkAllFlag: false
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
                // _this.totalMoney = res.data.result.totalMoney;
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
            // 数量改变计算总价
            this.calcTotalPrice();
        },
        //  选中/取消方法
        selectedProduct: function (item){
            //  data.json中没有checked变量，需要插入checked变量
            //  判断商品有没有选中
            //  使用typeof判断checked变量是否存在
            if (typeof item.checked == 'undefined'){
                //  使用vm.$set设置一个变量，让vue侦听。
                //  $set(对象,"变量名",值)
                Vue.set(item,"checked",true);           //全局注册
                //  this.$set(item,"checked",true);     // 局部注册
            }else {
                //  checked变量变为false
                item.checked = !item.checked;
            }
            // 调用选中计算总价
            this.calcTotalPrice();
        },
        //  全选flag判断true还是false
        checkAll: function(flag){
            //  控制当前第一次选中(点击选中，在点击取消)判断flag是:true还是false
            this.checkAllFlag = flag;
            var _this = this;
             //  使用forEach()进行遍历数组
             this.productList.forEach(function (item, index){
                //  首先判断商品有没有注册，如果没注册，则注册一下。
            if (typeof item.checked == 'undefined'){
                _this.$set(item,"checked",_this.checkAllFlag);     // 局部注册
            }else {
               //  取消全选：false
               item.checked = _this.checkAllFlag;
            }
            });
            // 全选调用计算总价
            this.calcTotalPrice();
        },
        // 计算总价
        calcTotalPrice: function(){
            var _this = this;
            // 遍历前总金额清零，不然会导致金额错误累加
            this.totalMoney = 0;
            this.productList.forEach(function (item, index){
                //  如果选中
                if(item.checked){
                    //  商品单价*数量
                    _this.totalMoney += item.productPrice * item.productQuantity;
                }
            });
        }
    }
})
// 全局格式化总价格
Vue.filter('money', function (val, type){
    return "￥" + val + type;
});