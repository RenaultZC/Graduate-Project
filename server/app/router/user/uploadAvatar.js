const fs = require('fs');
const path = require('path');


module.exports = ctx => {
  try {
    const file = ctx.request.files.file;
    const reader = fs.createReadStream(file.path);
    const filePath = `/avatar/${Date.now()}_${file.name}`;
    const stream = fs.createWriteStream(path.join(__dirname, '../../static', filePath));
    reader.pipe(stream);
    ctx.ok({ errpr: false, msg: { filePath } });
  } catch (e) {
    console.log(e);
    return ctx.notFound({ error: true, errCode: 1007 });
  }
};
