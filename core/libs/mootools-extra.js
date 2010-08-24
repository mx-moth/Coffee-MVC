Hash.implement({
	flip: function() {
		return this.getKeys().associate(this.getValues());
	}
});
