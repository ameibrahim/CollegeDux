<div class="overlay edit-course-details-overlay">
    <div class="popup">
        <div class="popup-header two-column-grid">
            <h1 class="pop-up-title">
                Edit Course Details
            </h1>
        </div>

        <div class="popup-body">
            <form class="edit-personal-details two-column-grid">
                <label for="courseEditImageUpload" class="personal-upload-input">
                    <div class="course-edit-view user-image">
                        <img class="course-edit-image-view-element" src="" alt="">
                    </div>

                    <input id="courseEditImageUpload" class="upload-input" type="file" accept="image/*"
                        onchange="loadImageToIMGView(event, '.course-edit-image-view-element')">
                </label>

                <div class="setting-values" style="align-self: center;">
                    <div class="form-input-container">
                        <span class="form-input-label">Course Code</span>
                        <input class="form-input course-code-review" placeholder="Course Code" type="text" required>
                    </div>

                    <div class="form-input-container">
                        <span class="form-input-label">Course Title</span>
                        <input class="form-input course-title-review" placeholder="Course Title" type="text" required>
                    </div>
                </div>
            </form>

        </div>

        <div class="popup-footer">
            <div class="button" id="saveCouseDetailChanges">Save Changes</div>
        </div>
    </div>
</div>