const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/test')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err))


const itemSchema = new mongoose.Schema({
    name: { type: String, required: true,},
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now() },
    isPublished: Boolean,
    price: {
        type: Number,
        require: function () { return this.isPublished } //基于isPublished的状态来判断是否price有非空限制, 此处不可用箭头函数替代,因为this的指向问题
    }
}) // available schema types: String, Number, Date, Buffer(for binary data), Boolean, ObjectID, Array 


//创建一个model,对应mongodb中的一个表, 此处传入的"Item'与表名存在特定对应关系, 不区分大小,
//Item,Items,会被映射为表名items,以s或x结尾的会被加es,符合英语复数规则
//对应数据库中的collection, 有则使用, 无则新建
const Item = mongoose.model('Item', itemSchema)

async function createItem() {
    const item = new Item({
        name: 'TOM',
        author: 'widd',
        tags: ['node'],
        isPublished: true
    })

    const result = await item.save()
    console.log(result)
}

createItem()
Item.find({ name: 'foo' }).then(items => console.log(items))
//query related: eq, ne, gt, lt, gte, lte, in, nin, or, and, regular expression
async function getItem() {
    const pageNumber = 2
    const pageSize = 10
    // GET /api/items?pageNumber=2&pageSize=10

    return await Item
        .find() // equivalent to no where clau
        .find({ name: /^foo/ }) // use regex
        .find({ price: { $gt: 10, $lt: 20 } }) // where price > 10 and price < 20
        .find({ price: { $in: [10, 15, 20] } }) // where price in(10,15,20)
        .or([{ name: 'widd' }, { isPublished: true }]) //代替find,使用or, and方法放置多个条件
        .and([{}, {}]) // 同上
        .limit(pageSize) //相当于limit 10
        .skip((pageNumber - 1) * pageSize) //相当于offset, 结合limit实现pagination分页, limit 10 offset (pageNumber-1)*PageSize
        .sort({ name: -1 }) //1表示升序,-1表示降序, 另一传参方式是 sort('name'), sort('-name')
        .select({ name: 1, tags: 1 }) //相当于select name, tags, 可选传参 select('name tags')
        .count() //替代上述,相当于select count(*)

    console.log(items)
} //amazing, mongoose make it just like writing sql 

// 更新数据, 先取数据,后发送更新语句,两次io
async function updateItem(id) {
    //获取item
    const item = await Item.findById(id)
    if (!item) return
    //更新item, 方式1
    item.isPublished = true
    item.author = 'tom'
    //更新item, 方式2
    item.set({
        isPublished: true,
        author: 'jack'
    })
    //发送更新语句到db, save会再返回该条数据
    const result = await item.save()
    console.log(result)
}
// updateItem('621c8966661be3f5c6c6853a')

//更新数据,不取得数据,直接修改,一次io, mongodb update operators, $inc, $min, $rename, $set...
async function updateItem(id) {
    // 方式一,直接更新,返回执行状态数据
    const result = await Item.updateOne({ _id: id }, {
        $set: {
            author: 'jerry',
            isPublished: true
        }
    })
    console.log(result)
    // 方式二,直接更新,返回数据项,而非执行状态数据
    const item = await Item.findByIdAndUpdate(id, {
        $set: {
            author: 'smith',
            isPublished: true
        }
    }, { new: true })  //第三个参数, {new:true}, 返回更新后的数据项,默认是返回更新前的数据项
    console.log(item)
}
// updateItem('621c8966661be3f5c6c6853a')

async function deleteItem(id) {
    //以下两种,区别同上
    const result = await Item.deleteOne({ _id: id })
    console.log(result)

    const item = await Item.findByIdAndDelete(id)
    console.log(item)

}
// deleteItem('621ca67bff2c9155d427b965')


//数据验证的话题, mongodb本身不对输入的数据最验证, 需再应用中自行实现验证逻辑, 通过定义合适的schema实现
//后续item.save(),或item.validate会触发验证
// 或者是通过Joi的input validation? 或者两者通用? mosh建议两者都有
const fooSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 5, maxlength: 255 },
    author: { type: String, match: /pattern/ },
    category: { 
        type: String, 
        enum: ['foo', 'bar'], 
        required: true,
        lowercase: true, //自动将输入转为小写
        uppercase: true, //自动转大写
        trim: true //自动去两边的空白字符, python的用词是strip
    },
    tags: {
        type: Array,
        validate: { //自定义验证器; 若io操作,可用异步验证, isAsync: true, validator: function(v,callback) {}
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'one tag at least'
        }
    },
    date: { type: Date, default: Date.now() },
    isPublished: Boolean,
    price: {
        type: Number,
        min: 10,
        max: 30,
        get: v => Math.round(v), //获取时,将该值round
        set: v => Math.round(v), //设置时,
        require: function () { return this.isPublished } //基于isPublished的状态来判断是否price有非空限制, 此处不可用箭头函数替代,因为this的指向问题
    }
})