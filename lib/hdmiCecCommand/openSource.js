if ( typeof sails !== 'undefined' && sails ) {
	module.exports = function openSource(options){
		var source = options.id;
		return gladys.param.getValue('HDMICEC_MACHINE_UUID_'+option.deviceId)
		.then((machineUuid) => {
			var json = '{"_type":"executeCommand","_command":"openSources", "_options":"'+source+'"}'
			var topic = 'gladys/machine/'+machineUuid+'/module/hdmicec/notify'
			return gladys.modules.mqtt.emit(topic,json)
		})
	}
} else {
	const shell = require('shelljs');

	module.exports = function getSources(source){

		var stdout = shell.exec('echo "scan" | cec-client -s -d 1', {silent:true}).stdout;

		var blockDevices = stdout.split('\n\n')

		blockDevices.forEach(function(device) {
			var lignes = device.split('\n')
			for (var i = 0; i < lignes.length; i++) {

				if(lignes[i].includes('device')){
					if(lignes[i].includes(source)) {
						address = chunk(lignes[i+1].split(':')[1].trim().replace(/\./g,''),2).join(' ')
					}
				}
			}
		})

		if (address !== undefined && address !== null) {
			shell.exec('echo "txn 40 9D '+address+'" | cec-client -s', {silent:true})
		}
	}

	function chunk(str, n) {
		var ret = [];
		var i;
		var len;

		for(i = 0, len = str.length; i < len; i += n) {
		ret.push(str.substr(i, n))
		}

		return ret
	};

}