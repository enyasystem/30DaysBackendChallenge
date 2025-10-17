function info(msg, meta){ console.log(JSON.stringify({ level: 'info', msg, ...meta })); }
function error(msg, meta){ console.error(JSON.stringify({ level: 'error', msg, ...meta })); }
module.exports = { info, error };
