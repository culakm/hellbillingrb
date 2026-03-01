<template>
	<q-page class="q-pa-md">
		<div class="q-pa-md q-gutter-sm">
			<q-editor
				class="form-item-note"
				v-model="note"
				label="Note"
				:toolbar="[
					['bold', 'italic', 'underline', 'strike'],
					['backColor', 'backColorDropdown'],
					['undo', 'redo'],
				]"
			>
				<template v-slot:backColor>
					<q-btn class="backColor" dense flat size="sm">
						<q-icon name="format_color_fill" :color="highlightColor === 'transparent' ? 'black' : highlightColor" @click="applyHighlight" />
					</q-btn>
				</template>
				<template v-slot:backColorDropdown>
					<q-btn-dropdown ref="backColorDropdown" class="backColorDropdown" dense no-wrap unelevated size="sm">
						<div class="row q-pa-sm q-gutter-sm">
							<q-btn
								v-for="c in ['transparent', 'red', 'blue', 'teal', 'green', 'yellow', 'orange', 'brown']"
								:key="c"
								size="sm"
								:style="{ backgroundColor: c }"
								@click="
									highlightColor = c;
									backColorDropdown.hide();
								"
							/>
						</div>
					</q-btn-dropdown>
				</template>
			</q-editor>

			<q-card style="min-height: 150px" flat bordered>
				<div class="note" v-html="note"></div>
			</q-card>
			<q-card style="min-height: 150px" flat bordered>
				<blockquote contenteditable="true">
					<p>Edit this content to add your own quote</p>
				</blockquote>
			</q-card>
		</div>
	</q-page>
</template>

<script setup>
import { ref } from "vue";

const note = ref("This is a sentence.");
const highlightColor = ref("");
const isTypingHighlight = ref(false);
const backColorDropdown = ref(null);
const applyHighlight = () => {
	const color = highlightColor.value || "transparent";
	const sel = window.getSelection();
	const hasSelection = sel && sel.rangeCount > 0 && !sel.getRangeAt(0).collapsed;

	if (hasSelection) {
		const range = sel.getRangeAt(0);
		const span = document.createElement("span");
		span.style.backgroundColor = color;

		try {
			range.surroundContents(span);
		} catch (e) {
			document.execCommand("styleWithCSS", false, true);
			if (!document.execCommand("hiliteColor", false, color) && !document.execCommand("backColor", false, color)) {
			}
		}
	} else {
		isTypingHighlight.value = !isTypingHighlight.value;
		const value = isTypingHighlight.value ? color : "transparent";

		document.execCommand("styleWithCSS", false, true);
		if (!document.execCommand("hiliteColor", false, value) && !document.execCommand("backColor", false, value)) {
		}
	}
};

// const markOrToggleColor = () => {
// 	const color = "red";
// 	const sel = window.getSelection();
// 	const hasSelection = sel && sel.rangeCount > 0 && !sel.getRangeAt(0).collapsed;

// 	if (hasSelection) {
// 		// Case 1: selected text → mark selection red
// 		const range = sel.getRangeAt(0);
// 		const span = document.createElement("span");
// 		span.style.backgroundColor = color;

// 		try {
// 			range.surroundContents(span);
// 		} catch (e) {
// 			document.execCommand("backColor", false, color);
// 		}
// 	} else {
// 		// Case 2: no selection → toggle red typing mode
// 		isTypingColor.value = !isTypingColor.value;

// 		document.execCommand("styleWithCSS", false, true);
// 		document.execCommand("backColor", false, isTypingColor.value ? color : "transparent");
// 	}
// }

const markSelectionRed = () => {
	const sel = window.getSelection();
	if (!sel || sel.rangeCount === 0) return;

	const range = sel.getRangeAt(0);
	if (range.collapsed) return; // nothing selected

	const span = document.createElement("span");
	span.style.backgroundColor = "red";
	range.surroundContents(span);
};

const highlightSelection = () => {
	const sel = window.getSelection();
	if (!sel || sel.rangeCount === 0) return;

	const range = sel.getRangeAt(0);
	if (range.collapsed) return;

	// Wrap selection in span with background color
	const span = document.createElement("span");
	span.style.backgroundColor = "#ffff00"; // yellow

	range.surroundContents(span);
};
</script>

<style scoped>
.q-editor .q-btn.backColor {
	margin-right: 0;
	padding-right: 0;
}

.q-editor .q-btn-dropdown.backColorDropdown {
	margin-left: 0;
	padding-left: 0;
}
</style>
