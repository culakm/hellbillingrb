<template>
    <form @submit.prevent="submitForm" class="line-form">
        <div class="form-item-name" :class="{ invalid: !name.isValid }">
            <label for="name">Meno</label>
            <input type="text" id="name" v-model.trim="name.val" @blur="clearValidity('name')" />
            <p v-if="!name.isValid">name must not be empty!</p>
        </div>
        <div class="form-item-kmTotal" :class="{ invalid: !kmTotal.isValid }">
            <label for="kmTotal">kmTotal</label>
            <input type="number" step="0.01" id="kmTotal" v-model.trim="kmTotal.val" @blur="clearValidity('kmTotal')" />
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
import { ref, computed } from 'vue';

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
    setup(props, { emit }) {
        const componentName = 'LineForm';

        const lineId = ref(props.line.lineId || null);
        const order = ref({ val: props.line.order || 0, isValid: true });
        const name = ref({ val: props.line.name || '', isValid: true });
        const kmTotal = ref({ val: props.line.kmTotal || null, isValid: true });
        const tulip = ref({ val: props.line.tulip || '', isValid: true });
        const mapPage = ref({ val: props.line.mapPage || null, isValid: true });
        const roadNo = ref({ val: props.line.roadNo || null, isValid: true });
        const interest = ref({ val: props.line.interest || [], isValid: true });
        const stop = ref({ val: props.line.stop || false, isValid: true });
        const note = ref({ val: props.line.note || '', isValid: true });
        const formIsValid = ref(true);

        const tulipSrc = computed(() => tulip.value.val ? `/img/${tulip.value.val}.svg` : '');

        function clearValidity(input) {
            if (input === 'name') name.value.isValid = true;
            if (input === 'kmTotal') kmTotal.value.isValid = true;
            if (input === 'mapPage') mapPage.value.isValid = true;
            if (input === 'roadNo') roadNo.value.isValid = true;
            if (input === 'tulip') tulip.value.isValid = true;
            if (input === 'note') note.value.isValid = true;
        }

        function validateForm() {
            formIsValid.value = true;

            // if (name.value.val === '') {
            //     name.value.isValid = false;
            //     formIsValid.value = false;
            // }
            // if (kmTotal.value.val === null || kmTotal.value.val === '') {
            //     kmTotal.value.isValid = false;
            //     formIsValid.value = false;
            // }
            // if (tulip.value.val === '') {
            //     tulip.value.isValid = false;
            //     formIsValid.value = false;
            // }
            // if (roadNo.value.val === '' || roadNo.value.val === null) {
            //     roadNo.value.isValid = false;
            //     formIsValid.value = false;
            // }
            // if (note.value.val === '') {
            //     note.value.isValid = false;
            //     formIsValid.value = false;
            // }
            // if (mapPage.value.val === '' || mapPage.value.val === null) {
            //     mapPage.value.isValid = false;
            //     formIsValid.value = false;
            // }
        }

        function submitForm() {
            validateForm();
            if (!formIsValid.value) {
                return;
            }
            const formData = {
                lineId: lineId.value,
                order: order.value.val,
                name: name.value.val,
                kmTotal: kmTotal.value.val,
                tulip: tulip.value.val,
                mapPage: mapPage.value.val,
                roadNo: roadNo.value.val,
                interest: interest.value.val,
                stop: stop.value.val,
                note: note.value.val,
                passed: false,
            };

            order.value.val = null;
            name.value.val = '';
            kmTotal.value.val = null;
            tulip.value.val = '';
            mapPage.value.val = '';
            roadNo.value.val = '';
            interest.value.val = [];
            stop.value.val = false;
            note.value.val = '';

            emit('save-line', formData);
        }

        return {
            componentName,
            line: props.line,
            order,
            name,
            kmTotal,
            tulip,
            mapPage,
            roadNo,
            interest,
            stop,
            note,
            formIsValid,
            tulipSrc,
            clearValidity,
            validateForm,
            submitForm
        };
    }
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