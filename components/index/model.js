class Model {
	constructor(tableName) {
		this.tableName = tableName
	}

	get table() { 
		return this.tableName
	}

	set table(name) {
		this.tableName = name
	}
}

export default Model