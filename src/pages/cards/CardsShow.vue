<template>
    <div class="export-container">
		<div class="settings-container">
			<div class="line">
				<label for="settingsRows">Rows:</label>
				<input type="number" step="1" id="settingsRows" v-model.trim="settingsRows"/>
			</div>
			<div class="line">
				<label for="settingsFontSize">FontSize:</label>
				<input type="number" step="1" id="settingsFontSize" v-model.trim="settingsFontSize"/>
			</div>
			<div class="line">
				<label for="settingsCellHeight">CellHeight:</label>
				<input type="number" step="1" id="settingsCellHeight" v-model.trim="settingsCellHeight"/>
			</div>
			<div class="line">
				<label for="settingsReverse">Reverse:</label>
				<input id="settings-reverse" name="settingsReverse" type="checkbox" v-model="settingsReverse" />
			</div>
			<base-button @click="exportToPDF">Export to PDF</base-button>
		</div>
        <textarea id="lala" class="styled-textarea"  v-model="inputData">
        </textarea>
    </div>
</template>

<script>
import { ref, watch } from 'vue';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import "@/assets/fonts/Montserrat-Regular-normal.js";
import "@/assets/fonts/Montserrat-Bold-normal.js";

export default {
name: 'CardsShow',
setup() {
	const componentName = 'CardsShow';
	const settingsFontSize = ref(12);
	const settingsRows = ref(5);
	const settingsCellHeight = ref(35);
	const settingsReverse = ref(true);
	const inputData = ref(null);

	watch(settingsReverse, (newValue) => {
		console.log('settingsReverse changed:', newValue);
	});
	// https://www.youpdf.com/
	var words = [
		{ english: 'cat', pronunciation: 'kæt', slovak: 'mačka' },
		{ english: 'dog', pronunciation: 'dɒɡ', slovak: 'pes' },
		{ english: 'sun', pronunciation: 'sʌn', slovak: 'slnko' },
		{ english: 'book', pronunciation: 'bʊk', slovak: 'kniha' },
		{ english: 'tree', pronunciation: 'triː', slovak: 'strom' },
		{ english: 'house', pronunciation: 'haʊs', slovak: 'dom' },
		{ english: 'water', pronunciation: 'ˈwɔːtə', slovak: 'voda' },
		{ english: 'apple', pronunciation: 'ˈæpl', slovak: 'jablko' },
		{ english: 'chair', pronunciation: 'tʃeə', slovak: 'stolička' },
		{ english: 'bread', pronunciation: 'brɛd', slovak: 'chlieb' },
		{ english: 'car', pronunciation: 'kɑːr', slovak: 'auto' },
		{ english: 'flower', pronunciation: 'ˈflaʊər', slovak: 'kvet' },
		{ english: 'bird', pronunciation: 'bɜːd', slovak: 'vták' },
		{ english: 'fish', pronunciation: 'fɪʃ', slovak: 'ryba' },
		{ english: 'milk', pronunciation: 'mɪlk', slovak: 'mlieko' },
		{ english: 'school', pronunciation: 'skuːl', slovak: 'škola' },
		{ english: 'phone', pronunciation: 'fəʊn', slovak: 'telefón' },
		{ english: 'table', pronunciation: 'ˈteɪbl', slovak: 'stôl' },
		{ english: 'window', pronunciation: 'ˈwɪndəʊ', slovak: 'okno' },
		{ english: 'door', pronunciation: 'dɔːr', slovak: 'dvere' },
		{ english: 'garden', pronunciation: 'ˈɡɑːdn', slovak: 'záhrada' },
		{ english: 'mountain', pronunciation: 'ˈmaʊntən', slovak: 'hora' },
		{ english: 'river', pronunciation: 'ˈrɪvər', slovak: 'rieka' },
		{ english: 'sky', pronunciation: 'skaɪ', slovak: 'nebo' },
		{ english: 'star', pronunciation: 'stɑːr', slovak: 'hviezda' },
		{ english: 'moon', pronunciation: 'muːn', slovak: 'mesiac' },
		{ english: 'train', pronunciation: 'treɪn', slovak: 'vlak' },
		{ english: 'bus', pronunciation: 'bʌs', slovak: 'autobus' },
		{ english: 'road', pronunciation: 'rəʊd', slovak: 'cesta' },
		{ english: 'pen', pronunciation: 'pɛn', slovak: 'pero' },
		{ english: 'pencil', pronunciation: 'ˈpɛnsəl', slovak: 'ceruzka' },
		{ english: 'shoe', pronunciation: 'ʃuː', slovak: 'topánka' },
		{ english: 'hat', pronunciation: 'hæt', slovak: 'klobúk' },

	];

	function fileName() {
		return 'hbc_' + new Date().toISOString().slice(0, 10).replace(/-/g, '_') + '.pdf';
	}

	function exportToPDF() {
		// words = eval(inputData.value);
		try {
			words = JSON.parse(inputData.value);
		} catch (e) {
			alert('Invalid input format. Please provide valid JSON.');
			return;
		}

		if (!words || words.length === 0) {
			alert('No data to export');
			return;
		}

		const doc = new jsPDF('l', 'mm', 'a4');
		doc.setFont("Montserrat-Regular");
		doc.setFont("Montserrat-Bold");
		const margin = 5;
		const pageWidth = 297;
		const pageHeight = 210;


		const rowsPerPage = settingsRows.value || 5;
		const colsPerPage = 4;
		const chunkSize = rowsPerPage * colsPerPage;
		const chunks = [];
		for (let i = 0; i < words.length; i += chunkSize) {
			chunks.push(words.slice(i, i + chunkSize));
		}

		chunks.forEach((chunk, index) => {
			for (let run = 0; run < 2; run ++) {

				const tableData = [];
				for (let i = 0; i < rowsPerPage; i++) {
					if (!chunk[i * colsPerPage]){
						break;
					}
					const row = [];
					for (let j = 0; j < colsPerPage; j++) {
						const index = i * colsPerPage + j;
						if (index >= chunk.length) {
							row.push('');
						} else {
							const word = chunk[index];
							if (run === 0) {
								row.push(word.english + '\n' + word.pronunciation);
							} else if (run === 1) {
								row.push(word.slovak);
							}
						}
					}
					if (run === 1 && settingsReverse.value) {
						row.reverse();
					}
					tableData.push(row);
				}

				autoTable(doc, {
					body: tableData,
					startY: margin ,
					margin: {
						top: margin,
						right: margin,
						bottom: margin,
						left: margin
					},
					styles: {
						font: 'Montserrat-Regular',
						halign: 'center',
						valign: 'middle',
						lineWidth: 1,
						lineColor: [0, 0, 0],
						cellPadding: 5,
						fontSize: settingsFontSize.value || 12,
						// minCellHeight: ((pageHeight - (margin * 2)) / rowsPerPage) - 10
						// pre 5 riadkov 35, fontsize 12
						// pre 4 riadky 45, fontsize 12

						minCellHeight: settingsCellHeight.value || 35,
					},
					columnStyles: {
						// 0: { cellWidth: (pageWidth - (margin * 2)) / 3, font: 'Montserrat-Bold' },
						0: { cellWidth: (pageWidth - (margin * 2)) / colsPerPage },
						1: { cellWidth: (pageWidth - (margin * 2)) / colsPerPage },
						2: { cellWidth: (pageWidth - (margin * 2)) / colsPerPage },
						3: { cellWidth: (pageWidth - (margin * 2)) / colsPerPage },
					},
					theme: 'grid',
					pageBreak: 'avoid',
				});
				// Add a new page after each chunk except the last one
				if (index < chunks.length ) {
					doc.addPage();
				}
			}
		});

		// Delete the last page
		var pageCount = doc.internal.getNumberOfPages();
		doc.deletePage(pageCount);

		doc.save(fileName());
	}


	return {
		settingsFontSize,
		settingsRows,
		settingsCellHeight,
		settingsReverse,
		inputData,
		exportToPDF,
	};
}
};
</script>

<style scoped>
.export-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
}

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.settings-container .line {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.settings-container label {
  margin-right: 10px;
  white-space: nowrap;
}

.settings-container input {
  flex: 1;
}

.styled-textarea {
    width: 100%;
    height: 50rem;
	min-height: 50rem;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: none;
	flex-grow: 1;
}

.styled-textarea:focus {
    outline: none;
    border-color: #344a60;
}

</style>