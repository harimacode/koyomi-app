function set(id, value) {
    document.getElementById(id).innerText = value;
}
function dayOfWeek(dow) {
    switch (dow) {
        case 0: return '日';
        case 1: return '月';
        case 2: return '火';
        case 3: return '水';
        case 4: return '木';
        case 5: return '金';
        case 6: return '土';
    }
    return null;
}
function main() {    
    var today = new Date();
    var month = today.getMonth() + 1; // 月は 0 始まり
    set("date", month + '/' + today.getDate());
    set('dayOfWeek', dayOfWeek(today.getDay()));
    
    //testJuliusDate();
    testDynamicalTime();
    testSolarEclipticLongitude();
    testLunarEclipticLongitude();
}
