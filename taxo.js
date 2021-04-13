const { taxonomy_permissions: [{ children }] } = require('./cats.json');
let csv = '"Код","Название","Родитель"\n';

const getCats = (cats, parent) => {
  cats.forEach(({ id, label, children }) => {
    csv += `"${id}","${label}","${parent||''}"\n`;
    if (children && children.length){
      getCats(children, id);
    }
  });
};
getCats(children);

console.log(csv);
