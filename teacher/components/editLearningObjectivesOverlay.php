<div class="overlay edit-learning-objectives-overlay">
    <div class="popup">
        <div class="popup-header two-column-grid">
            <h1 class="pop-up-title">
                <text>Edit Learning Objectives</text>
            </h1> 

            <div class="objectives-action-buttons">
                <label for="excelObjectiveUpload" class="circular-button upload-objectives">
                    <img src="../assets/icons/up-arrow.png" alt="">
                    <input type="file" id="excelObjectiveUpload" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onchange="loadExcelToObjectiveSheetView(event)">
                </label>
                <div class="circular-button reload-objectives" onclick="refreshObjectives()">
                    <img src="../assets/icons/reload.png" alt="">
                </div>
                <div class="button save-learning-objectives-button">
                    <text>Save and Close</text>
                </div>
                <div class="close-button" style="position:relative; top: unset; right: unset;" onclick="closePopup('.edit-learning-objectives-overlay')">
                    <img src="../assets/icons/close.png" alt="">
                </div>
            </div>
        </div>

        <div class="popup-body">

            <div class="outer-objective-container">
                
            </div>

            <div class="add-learning-objective-button">
                <img src="../assets/icons/fi/fi-rr-plus.svg" alt="">
            </div>
            
        </div>
    </div>
</div>