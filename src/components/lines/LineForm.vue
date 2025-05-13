<template>
	<form @submit.prevent="submitForm" class="line-form">
		<div class="form-item-name" :class="{ invalid: !name.isValid }">
			<label for="name">Meno</label>
			<input type="text" id="name" v-model.trim="name.val" @blur="clearValidity('name')" />
			<p v-if="!name.isValid">name must not be empty!</p>
		</div>
		<div class="form-item-kmTotal" :class="{ invalid: !kmTotal.isValid }">
			<label for="kmTotal">kmTotal</label>
			<input type="number" id="kmTotal" v-model.trim="kmTotal.val" @blur="clearValidity('kmTotal')" />
			<p v-if="!kmTotal.isValid">kmTotal must not be empty!</p>
		</div>
		<div class="form-item-mapPage" :class="{ invalid: !mapPage.isValid }">
			<label for="mapPage">mapPage</label>
			<input type="text" id="mapPage" v-model.trim="mapPage.val" @blur="clearValidity('mapPage')" />
			<p v-if="!mapPage.isValid">mapPage must not be empty!</p>
		</div>
		<div class="form-item-roadNo" :class="{ invalid: !roadNo.isValid }">
			<label for="roadNo">RoadNo</label>
			<input type="text" id="roadNo" v-model.trim="roadNo.val" @blur="clearValidity('roadNo')" />
			<p v-if="!roadNo.isValid">RoadNo must not be empty!</p>
		</div>
		<div class="form-item-tulip" :class="{ invalid: !tulip.isValid }">
			<div>
				<label for="tulip" class="form-item-tulip-label">Tulip</label>
				<select class="form-item-tulip-select" id="tulip" v-model="tulip.val" @change="clearValidity('tulip')">
					<option value="">Select a Tulip</option>
					<option value="tulipR">Tulip Right</option>
					<option value="tulipL">Tulip Left</option>
					<option value="tulipF">Tulip Front</option>
				</select>
			</div>
			<img class="form-item-tulip-img" v-if="tulip.val" :src="tulipSrc" alt="Selected Tulip" />
			<p class="form-item-tulip-img-placeholder" v-else>Tulip</p>
			<p v-if="!tulip.isValid">Tulip must be selected!</p>
		</div>
		<div class="form-item-interest">
			<label for="interest">Zaujímavosť</label>
			<div>
				<input id="interest-history" name="interest" type="checkbox" value="history" v-model="interest.val" />
				<label for="interest-history">Pamiatky</label>
			</div>
			<div>
				<input id="interest-culture" name="interest" type="checkbox" value="culture" v-model="interest.val" />
				<label for="interest-culture">Kultúra</label>
			</div>
			<div>
				<input id="interest-sport" name="interest" type="checkbox" value="sport" v-model="interest.val" />
				<label for="interest-sport">Šport</label>
			</div>
		</div>
		<div class="form-item-stop">
			<label for="stop">Zastaviť</label>
			<div>
				<input id="stop" name="stop" type="checkbox" v-model="stop.val" />
				<label for="stop">Zastaviť</label>
			</div>

		</div>
		<div class="form-item-note" :class="{ invalid: !note.isValid }">
			<label for="note">Note</label>
			<textarea id="note" rows="2" v-model.trim="note.val" @blur="clearValidity('note')"></textarea>
			<p v-if="!note.isValid">Note must not be empty!</p>
		</div>
		<p v-if="!formIsValid">Please fix errors</p>
		<div class="form-item-buttons">
			<template v-if="Object.keys(line).length === 0">
				<base-button>Add</base-button>
			</template>
			<template v-else>
				<base-button>Save</base-button>
				<base-button @click="$emit('cancel-edit')">Cancel</base-button>
			</template>
		</div>
	</form>

</template>

<script>
export default {
	name: 'LineForm',
	emits: ['save-line', 'cancel-edit'],
	props: {
		line: {
			type: Object,
			required: false,
			default: () => ({}),
		},
	},
	data() {
		return {
			order: {
				val: '',
				isValid: true
			},
			name: {
				val: '',
				isValid: true
			},
			kmTotal: {
				val: null,
				isValid: true
			},
			tulip: {
				val: '',
				isValid: true
			},
			mapPage: {
				val: '',
				isValid: true
			},
			roadNo: {
				val: '',
				isValid: true
			},
			interest: {
				val: [],
				isValid: true
			},
			stop: {
				val: false,
				isValid: true
			},
			note: {
				val: '',
				isValid: true
			},
			formIsValid: true,
		};
	},
	created() {
		this.lineId = this.line.lineId || null;
		this.order.val = this.line.order || 0;
		this.name.val = this.line.name || '';
		this.kmTotal.val = this.line.kmTotal || null;
		this.tulip.val = this.line.tulip || '';
		this.mapPage.val = this.line.mapPage || null;
		this.roadNo.val = this.line.roadNo || null;
		this.interest.val = this.line.interest || [];
		this.stop.val = this.line.stop || false;
		this.note.val = this.line.note || '';
	},
	computed: {
		tulipSrc() {
			return `/img/${this.tulip.val}.svg`;
		},
	},
	methods: {
		clearValidity(input) {
			this[input].isValid = true;
		},
		validateForm() {
			this.formIsValid = true;
			// if (this.name.val === '') {
			// 	this.name.isValid = false;
			// 	this.formIsValid = false;
			// }
			// if (this.kmTotal.val === null) {
			// 	this.kmTotal.isValid = false;
			// 	this.formIsValid = false;
			// if (this.tulip.val === '') {
			// 	this.tulip.isValid = false;
			// 	this.formIsValid = false;
			// }
			// if (this.roadNo.val === '') {
			// 	this.roadNo.isValid = false;
			// 	this.formIsValid = false;
			// }
			// if (this.note.val === '') {
			// 	this.note.isValid = false;
			// 	this.formIsValid = false;
			// }
		},
		submitForm() {
			this.validateForm();
			if (!this.formIsValid) {
				return;
			}
			const formData = {
				lineId: this.lineId,
				order: this.order.val,
				name: this.name.val,
				kmTotal: this.kmTotal.val,
				tulip: this.tulip.val,
				mapPage: this.mapPage.val,
				roadNo: this.roadNo.val,
				interest: this.interest.val,
				stop: this.stop.val,
				note: this.note.val,
				passed: false,
			};

			this.order.val = null;
			this.name.val = '';
			this.kmTotal.val = null;
			this.tulip.val = '';
			this.mapPage.val = '';
			this.roadNo.val = '';
			this.interest.val = [];
			this.stop.val = false;
			this.note.val = '';

			this.$emit('save-line', formData);
		},
	},
};
</script>

<style scoped>
	.line-form {
		font-size: 0.8rem;
		width: 100%;
		display: grid;
		grid-template-areas:
			"form-item-name form-item-kmTotal form-item-mapPage form-item-roadNo form-item-tulip form-item-buttons"
			"form-item-interest form-item-interest form-item-stop form-item-note form-item-tulip form-item-buttons";
	}

	.form-item {
		margin: 0.5rem 0;
	}

	label {
		font-weight: bold;
		display: block;
		margin-bottom: 0.5rem;
	}

	input[type='checkbox']+label {
		font-weight: normal;
		display: inline;
		margin: 0 0 0 0.5rem;
	}

	input,
	textarea {
		display: block;
		width: 100%;
		border: 1px solid #ccc;
		font: inherit;
	}

	input:focus,
	textarea:focus {
		background-color: #f0e6fd;
		outline: none;
		border-color: #3d008d;
	}

	input[type='checkbox'] {
		display: inline;
		width: auto;
		border: none;
	}

	input[type='checkbox']:focus {
		outline: #3d008d solid 1px;
	}

	h3 {
		margin: 0.5rem 0;
		font-size: 1rem;
	}

	.invalid label {
		color: red;
	}

	.invalid input,
	.invalid textarea {
		border: 1px solid red;
	}

	[class^="form-item"] {
		padding: 0.3rem;
	}

	.form-item-name {
		grid-area: form-item-name;
	}

	.form-item-kmTotal {
		grid-area: form-item-kmTotal;
	}

	.form-item-mapPage {
		grid-area: form-item-mapPage;
	}

	.form-item-roadNo {
		grid-area: form-item-roadNo;
	}

	.form-item-interest {
		grid-area: form-item-interest;
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	.form-item-stop {
		grid-area: form-item-stop;
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	.form-item-note {
		grid-area: form-item-note;
	}

	.form-item-tulip {
		grid-area: form-item-tulip;
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	.form-item-tulip-label {
		margin-bottom: 0;
		padding: 0 0 0.5rem 0;
	}

	.form-item-tulip-select {
		margin: 0;
		padding: 0;
	}

	.form-item-tulip-img {
		place-self: center;
		max-height: 50px;
		margin: 0;
		padding: 0;
	}

	.form-item-tulip-img-placeholder {
		place-self: center;
		padding: 0;
	}

	li form button.form-item-button {
		justify-self: center;
		align-self: center;
		height: 2rem;
		padding: 5px;
	}

	.form-item-buttons {
		grid-area: form-item-buttons;
		display: flex;
		flex-direction: column;
		align-items: normal;
		justify-content: space-evenly;
	}
</style>