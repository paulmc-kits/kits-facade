const protectedMiddleWare = function(req,res,next){
    if(res.locals?.authenticated) next()
    else return res.redirect('/login')
}

module.exports = {protectedMiddleWare}