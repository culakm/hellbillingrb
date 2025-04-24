<template>
	<main>
		<base-dialog @close="handleError" :show="!!error" title="An error is ocurred!">
			<p>{{ error }}</p>
		</base-dialog>
		<section>
			<base-card>
				<div v-if="isLoading">
					<base-spinner></base-spinner>
				</div>
				<div v-else-if="trip">
					<h2>{{ trip.name }}</h2>
					<p>linesCount: {{ trip.linesCount }}</p>
					<trip-form @save-data="updateTripLocal" :trip="trip"></trip-form>
				</div>
			</base-card>
		</section>
		<section>
			<base-card>
				<line-form @save-line="createLineLocal" :trip="trip"></line-form>
			</base-card>
		</section>
		<section>
			<ul v-if="hasLines">
				<draggable :list="trip.lines" :disabled="!draggableEnabled" item-key="order" class="list-group"
					ghost-class="ghost" @start="dragging = true" @end="onEnd">
					<template #item="{ element }">
						<div class="list-group-item" :class="{ 'not-draggable': !draggableEnabled }">
							<line-actions class="line-item" :key="element.lineId" :line="element" :trip-id="trip.tripId"
								@line-is-edited="lineIsEdited"></line-actions>
						</div>
					</template>
				</draggable>
			</ul>
		</section>
	</main>
</template>

<script>
import { errorMixin } from '@/mixins/errorMixin';
import { mapGetters, mapActions } from 'vuex';
import draggable from "vuedraggable";
import TripForm from '../../components/trips/TripForm.vue';
import LineForm from '../../components/lines/LineForm.vue';
import LineActions from '../../components/lines/LineActions.vue';

export default {
	name: 'TripEdit',
	mixins: [errorMixin],
	components: {
		draggable,
		TripForm,
		LineForm,
		LineActions,
	},
	data() {
		return {
			isLoading: false,
			error: null,
			draggableEnabled: true,
			dragging: false,
			tripId: null,
		};
	},
	computed: {
		...mapGetters('trips', ['trip', 'hasLines'])
	},
	created() {
		this.tripId = this.$route.params.tripId;
		this.tripByIdLocal();
	},
	methods: {
		...mapActions('trips', ['tripById', 'createLine', 'updateTrip', 'updateLines']),
		async tripByIdLocal() {
			this.isLoading = true;
			try {
				await this.tripById(this.tripId);
			} catch (error) {
				this.$loadErrorMessage(this.$options.name, error);
			}
			this.isLoading = false;
		},
		async updateTripLocal(tripData) {
			this.isLoading = true;
			tripData.linesCount = this.trip.linesCount;
			try {
				await this.updateTrip(tripData);
			} catch (error) {
				this.$loadErrorMessage(this.$options.name, error);
			}

			this.isLoading = false;

		},
		async createLineLocal(lineData) {
			this.isLoading = true;
			const lastOrder = this.trip.lines.length;
			lineData.order = lastOrder + 1;
			lineData.tripId = this.trip.tripId;
			try {
				await this.createLine(lineData);
			} catch (error) {
				this.$loadErrorMessage(this.$options.name, error);
			}
			this.isLoading = false;
		},
		lineIsEdited() {
			this.draggableEnabled = !this.draggableEnabled;
			// toto je hack, aby se to reloadlo a zobrazili sa tam kmParty
			if (this.draggableEnabled) {
				window.location.reload();
			}

		},
		onEnd(evt) {
			this.dragging = false;
			this.trip.lines.forEach((line, index) => {
				line.order = index + 1;
			});
			this.updateLines({ lines: this.trip.lines, tripId: this.trip.tripId });
		},

	},
};
</script>

<style scoped>
	.buttons {
		margin-top: 35px;
	}

	.ghost {
		opacity: 0.5;
		background: #c8ebfb;
	}

	.not-draggable {
		cursor: no-drop;
	}
</style>