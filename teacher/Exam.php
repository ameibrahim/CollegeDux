<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dux Teacher</title>
    <page data-id="Exam"></page>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>

    <?php include '../include/teacherImports.php'; ?>
    <script src="../js/exam.js?5"></script>
    <script src="../js/BatchGenerator.js?2"></script>

</head>

<body>

    <?php include 'components/header.php'; ?>

    <div class="outer-container">
        <?php include 'components/sidebar.php'; ?>
        <div class="main-container">
                <div class="header-combo">
                    <h1 class="large-title">
                        Exam
                    </h1>
                </div>
            
                <div class="course-view-container" id="student-exam-container" style="margin-top:10px">
                    <div class="container-message blank course-view-container-loader" style="height: 100%">
                        <div class="sk-fold">
                            <div class="sk-fold-cube"></div>
                            <div class="sk-fold-cube"></div>
                            <div class="sk-fold-cube"></div>
                            <div class="sk-fold-cube"></div>
                        </div>
                    </div>
                </div>

            <div class="edit-exam-container inner-overlay">

                <div class="back-arrow" onclick="openPopup('.course-view-container','back'); closePopup('.edit-exam-container')">
                    <img class="icon" src="../assets/icons/fi/fi-rr-arrow-alt-left.svg" alt="">
                </div>

                <?php include 'components/editExamOverlay.php' ?>

            </div>

            <?php include 'components/createExamOverlay.php' ?>

        </div>
    </div>

    <script>

        const URLID = getURLParameter("id");
        if(URLID && URLID.length > 1){
            editExam({ id: URLID });
        }

        ( async () => {
            await loadCoursesGeneric("id", editExam, { emptyMessage: "No Courses To Create Exams For Yet." });
        })();

    </script>
    
</body>

</html>