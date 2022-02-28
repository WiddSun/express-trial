//使用es6的promise对象来写异步代码, 替代callback的写法,避免所谓的callback hell
//基于promise, 后续的async/await语法又进一步简化了异步代码的写法

function fetchFoo() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if ('got data sucessfully') return resolve(1)
            reject(new Error('something went wrong, data cannot be fetched from database'))
        }, 2000)
    })
} 

function fetchBar() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if ('got data sucessfully') return resolve(2)
            reject(new Error('something went wrong, data cannot be fetched from database'))
        }, 2010)
    })
} 

//most common usage
fetchFoo()
    .then((result) => console.log('Result is', result))
    .catch((err) => console.error(err.message))



//有关promise的其它api
//使用Promise的静态方法创建resolved and rejected promise, 主要用于单元测试
Promise.resolve(1)
    .then(result => console.log('result is', result))
Promise.reject(new Error('went wrong'))
    .catch(err => console.error(err.message))

//都解决,才then,否则catch, result是数组放了每个单独promise的结果值
Promise.all([fetchFoo(), fetchBar()])
    .then(result => console.log(`all result is ${result}`))
    .catch(err => console.error(err.message))

//只要有一先解决,就then, 都未解决才catch, result是单个值, 此处个人觉得用any一词也很合适
Promise.race([fetchFoo(), fetchBar()])
    .then(result => console.log(`winning result is ${result}`)) 
    .catch(err => console.error(err.message))


//rewrite, use async/await, 使得写异步代码就像写同步代码一样的风格
//需将代码包括在try...catch...中

async function fetchSomething() {
    try {
        let foo = await fetchFoo()
        let bar = await fetchBar()
        console.log(`foo is ${foo}, and bar is ${bar}`)
    }
    catch (err) {
        console.error(err.message)
    }
}
fetchSomething()

