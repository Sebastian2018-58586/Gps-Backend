const { Server } = require("socket.io");
let io;

function configSocket(server) {
    io = new Server(server,{
        cors:{
            origins: ['http://localhost:4200']
        }
    });
    io.on('connection', (socket) => {
      console.log('Administrador conectado');
    });
    io.on('disconnect',(socket)=>{
      console.log('Administrador desconectado');
    })
}

async function countOrdersEarring(res,db,idOrder){
  try {
    const objSearch = {idOrder}
    const {count,rows} = await db.Detail_Order.findAndCountAll({
      where:objSearch,
      include:[
        {
          model:db.Order,
          where:{state:'pendiente'}
        },{
          model:db.Product,
          attributes:['id','name','description']
        }
      ]
    });
    console.log(count)
    if(count || count===0){
      io.emit('detailsOrder',{count,rows});
    }
  } catch (error) {
    return res.status(400).json({
      ok:false,
      msg:error
    });
  }
}

async function countOrdersDone (res,db){
    try {
      const objSearch = {state:'pagado'}
      const {count} = await db.Order.findAndCountAll({
        where:objSearch,
      });
      if(count || count===0){
        io.emit('orders',count);
      }
    } catch (error) {
      return res.status(400).json({
        ok:false,
        msg:error
      });
    }
}

module.exports = {configSocket,countOrdersDone,countOrdersEarring}