
const viewAllDepartments = () => {
    db.query("SELECT * FROM department", (err, result) => {
    if (err) {console.log(err)};
    console.table(result);
    init();
})}