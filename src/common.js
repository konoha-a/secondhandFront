//获取当前时间（XXXX-XX-XX）
export function getCurDate() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    return year + "-" + month + "-" + day;
  }
  //向sessionStorage中存储一个JSON对象
  export function setSessionStorage(keyStr, value) {
    sessionStorage.setItem(keyStr, JSON.stringify(value));
  }
  //从sessionStorage中获取一个JSON对象（取不到时返回null）
  export function getSessionStorage(keyStr) {
    var str = sessionStorage.getItem(keyStr);
    if (str == "" || str == null || str == "null" || str == undefined) {
      return null;
    } else {
      return JSON.parse(str);
    }
  }
  //从sessionStorage中移除一个JSON对象
  export function removeSessionStorage(keyStr) {
    sessionStorage.removeItem(keyStr);
  }
  //向localStorage中存储一个JSON对象
  export function setLocalStorage(keyStr, value) {
    localStorage.setItem(keyStr, JSON.stringify(value));
  }
  //从localStorage中获取一个JSON对象（取不到时返回null）
  export function getLocalStorage(keyStr) {
    var str = localStorage.getItem(keyStr);
    if (str == "" || str == null || str == "null" || str == undefined) {
      return null;
    } else {
      return JSON.parse(str);
    }
  }
  //从localStorage中移除一个JSON对象
  export function removeLocalStorage(keyStr) {
    localStorage.removeItem(keyStr);
  }
  //制保留2位小数，如：2，会在2后面补上00.即2.00
  export function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
      return false;
    }
     f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf(".");
    if (rs < 0) {
      rs = s.length;
      s += ".";
    }
    while (s.length <= rs + 2) {
      s += "0";
    }
    return s;
  }

  /**
 * 重置对象（会修改原始对象）
 * @param object
 * @param defaultVal
 */
export function resetObject(object, defaultVal = {}) {
  for (let k in object) {
    if (defaultVal.hasOwnProperty(k)) {
      object[k] = defaultVal[k];
    } else {
      if (Array.isArray(object[k])) object[k] = [];
      if ("string" == typeof object[k]) object[k] = "";
      if ("number" == typeof object[k]) object[k] = null;
      if ("boolean" == typeof object[k]) object[k] = false;
    }
  }
}