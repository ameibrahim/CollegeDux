<script lang="javascript" src="https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js"></script>

<div class="inner-header">
    <div style="display: grid; grid-gap: 10px; align-items: start; grid-template-rows: auto 1fr;">
        <h1 class="medium-title" id="course-title"></h1>
        <p class="small-title" id="course-code"></p>
        <div class="button" id="editCourseDetails" style="justify-self:start;">
            <text>Edit Course Details</text>
        </div>
        <div class="button" id="editLearningObjectives" style="justify-self:start;">
            <text>Edit Learning Objectives</text>
        </div>
        <div class="button" id="deleteCourseButton" style="justify-self:start;">
            <text>Delete Course</text>
        </div>
    </div>

    <div style="display: grid; grid-gap: 10px; align-items: start; grid-template-rows: auto auto auto;">
        <label for="excelCourseFileUpload" class="button" id="excelUploadButton">
            <div>
                <input type="file" id="excelCourseFileUpload"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                <img src="../assets/icons/excel.png" alt="">
                <text>Excel Upload</text>
            </div>
        </label>

        <div class="button" id="saveCourseDetails">
            <text>Save</text>
        </div>
        <div class="button" id="addNewLecture">
            <text>Add New Lecture</text>
        </div>
    </div>
</div>

<div class="grid-container" id="course-grid-container">
</div>