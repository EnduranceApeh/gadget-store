export async function fetchData() {
    try{
        const response = await fetch('/data/gadgets.json')
        const obj = await response.json()
        return obj.products
    } catch (err){
        console.log(err)
    }
}