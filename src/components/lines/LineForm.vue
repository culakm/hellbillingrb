<template>
	<form @submit.prevent="submitForm">
		<div class="form-control" :class="{ invalid: !name.isValid }">
			<label for="name">Name</label>
			<input type="text" id="name" v-model.trim="name.val" @blur="clearValidity('name')" />
			<p v-if="!name.isValid">name must not be empty!</p>
		</div>
		<div class="form-control form-control-tulip" :class="{ invalid: !kmTotal.isValid }">
			<label for="kmTotal">kmTotal</label>
			<input type="number" id="kmTotal" v-model.trim="kmTotal.val" @blur="clearValidity('kmTotal')" />
			<p v-if="!kmTotal.isValid">kmTotal must not be empty!</p>
		</div>
		<div class="form-control" :class="{ invalid: !tulip.isValid }">
			<label for="tulip">Tulip</label>
			<select id="tulip" v-model="tulip.val" @change="clearValidity('tulip')">
				<option value="">Select a Tulip</option>
				<option value="tulipR">Tulip Right</option>
				<option value="tulipL">Tulip Left</option>
				<option value="tulipF">Tulip Front</option>
			</select>
			<!-- Image preview -->
			<img class="tulip-img" v-if="tulip.val" :src="tulipSrc" alt="Selected Tulip" />
			<p v-if="!tulip.isValid">Tulip must be selected!</p>
		</div>
		<div class="form-control form-control-tulip" :class="{ invalid: !roadNo.isValid }">
			<label for="roadNo">RoadNo</label>
			<input type="text" id="roadNo" v-model.trim="roadNo.val" @blur="clearValidity('roadNo')" />
			<p v-if="!roadNo.isValid">RoadNo must not be empty!</p>
		</div>
		<div class="form-control">
			<label for="interest">Zaujímavosť</label>
			<div>
				<input id="interest-history" name="interest" type="checkbox" value="history" v-model="interest.val" />
				<label for="interest-history">Pamiatky</label>
			</div>
			<div>
				<input id="interest-culture" name="interest" type="checkbox" value="culture" v-model="interest.val" />
				<label for="interest-tutorials">Kultúra</label>
			</div>
			<div>
				<input id="interest-sport" name="interest" type="checkbox" value="sport" v-model="interest.val" />
				<label for="interest-sport">Šport</label>
			</div>
		</div>
		<div class="form-control">
			<label for="stop">Zastaviť</label>
			<div>
				<input id="stop" name="stop" type="checkbox" v-model="stop.val" />
				<label for="stop">Zastaviť</label>
			</div>

		</div>
		<div class="form-control" :class="{ invalid: !note.isValid }">
			<label for="note">Note</label>
			<textarea id="note" rows="2" v-model.trim="note.val" @blur="clearValidity('note')"></textarea>
			<p v-if="!note.isValid">Note must not be empty!</p>
		</div>
		<p v-if="!formIsValid">Please fix errors</p>
		<base-button v-if="Object.keys(line).length === 0">Add Line</base-button>
		<base-button v-else>Edit Line</base-button>
	</form>
</template>

<script>
export default {
	name: 'LineForm',
	emits: ['save-line'],
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
	.form-control {
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

	/* .tulip-img {
	width: 40px;
	height: 40px;
} */

	.form-control-tulip {
		display: flex;
		align-items: center;
		/* Aligns items vertically in the center */
		gap: 20px;
		/* Adds some space between the select and the image */
	}

	.tulip-img {
		max-width: 100px;
		/* Adjusts the image width */
		height: auto;
		/* Keeps the image aspect ratio */
	}
</style>