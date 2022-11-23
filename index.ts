/**
 * url params
 * */
const getUrlParams = (path: string, pattern: string): object => {
    let params: { [index: string]: string } = {};
    let path_splits: string[] = path.split('/');
    let pattern_splits: string[] = pattern.split('/');

    path_splits.forEach((value: string, index: number) => {
        if (pattern_splits[index] !== path_splits[index] && !pattern_splits[index].includes(':')) return true;
        if (pattern_splits[index].includes(':')) params[pattern_splits[index].replace(':', '')] = path_splits[index];
    });

    return params;
}

const pattern = 'staticOne/:paramOne/staticTwo/staticThree/:paramTwo'
const testPath1 = 'staticOne/one/staticTwo/staticThree/two'
const testPath2 = 'staticZero/one'
const testPath3 = 'staticOne/one'
const testPath4 = 'staticOne/one/staticThree/three'

console.log("testPath",testPath1)
console.log("Params :", getUrlParams(testPath1, pattern));
console.log("testPath",testPath2)
console.log("Params :", getUrlParams(testPath2, pattern));
console.log("testPath",testPath3)
console.log("Params :", getUrlParams(testPath3, pattern));
console.log("testPath",testPath4)
console.log("Params :", getUrlParams(testPath4, pattern));

/**
 * object diff
 * */
type Data = { [index: string]: any, id: number, name?: string, count: number }
const source: Data = {id: 1, count: 0}
const target: Data = {id: 1, name: 'khan', count: 1}
const source1: Data = {id: 1, count: 0, address: {district: 'Lalitpur', province: 'Bagmati'},phones:['123456','78965'],location:[['abc','xyz'],['aaa',23]]}
const target1: Data = {id: 1, name: 'khan', count: 1, address: {district: 'Kathmandu', province: 'Bagmati'},phones:['123456','78965'],location:[['abc','xyz'],['aaa',23]]}
const source2: Data = {id: 1, count: 0, address: {district: 'Lalitpur', province: 'Bagmati'},phones:['123456','78965'],location:[['jkg','xyz'],['aaa',23]]}
const target2: Data = {id: 1, name: 'khan', count: 1, address: {district: 'Kathmandu', province: 'Bagmati'},phones:['123456','4568'],location:[['abc','xyz'],['nbb',23]]}

interface ObjectDataType { [key: string]: any }

const objectDiff = (source: Data, target: Data) => {
    let diff: ObjectDataType = {};
    let source_keys: string[] = Object.keys(source);
    let target_keys: string[] = Object.keys(target);
    let keys: string[] = source_keys.length > target_keys.length ? source_keys : target_keys;

    keys.forEach((key: string) => {
        let old_new: ObjectDataType = {};
        old_new['old'] = !(source_keys.includes(key)) ? 'undefined' : source[key];
        old_new['new'] = !(target_keys.includes(key)) ? 'undefined' : target[key];
        if(typeof old_new['old'] !== typeof old_new['new']){
            diff[key] = old_new;
            return;
        }
        if(isArrayType(old_new['old'])){
            if(!isArrayEqual(old_new['old'],old_new['new'])){
                diff[key] = old_new;
                return;
            }
        }else if (isObjectType(old_new['old'])) {
            let inner_diff = objectDiff(old_new['old'], old_new['new']);
            if (Object.keys(inner_diff).length !== 0) diff[key] = inner_diff;
            return;
        }else if(old_new['old'] !== old_new['new']){
            diff[key] = old_new;
        }
    });

    function isArrayEqual(array1:Array<any>,array2:Array<any>):boolean{
        let result : boolean = false;
        array1 = array1.sort();
        array2 = array2.sort();
        let loopingArray : Array<any> = array1.length > array2.length ? array1 : array2
        for(let i:number = 0; i<loopingArray.length; i ++){
            let elem1 = array1[i];
            let elem2 = array2[i];

            if(isArrayType(elem1)){
                return  isArrayEqual(elem1,elem2);
            }
            if(elem1 != elem2){
                result = false;
                break;
            }else {
                result = true;
            }
        }
        return result;
    }

    function isArrayType(param:any):boolean{
        return Array.isArray(param)
    }

    function isObjectType(param:any):boolean{
        return typeof param === 'object'
    }

    return diff;
}

console.log("\nDifference 1\n", JSON.stringify(objectDiff(source, target)));
console.log("\nDifference 2\n", JSON.stringify(objectDiff(source1, target1)));
console.log("\nDifference 3\n", JSON.stringify(objectDiff(source2, target2)));
