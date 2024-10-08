<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dux Student</title>
        <page data-id="Documents"></page> 

        <?php include '../include/studentImports.php'; ?>

        <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.5.141/build/pdf.min.js"></script>


    </head>
    <body>

        <?php include 'components/header.php'; ?>

        <div class="outer-container">
            <?php include 'components/sidebar.php'; ?>
            <div class="main-container">        
                <h1 class="large-title">E-books</h1>
                
                <div class="ebooks-outer-container">
                </div>
            </div>
        </div>

        <script>

            const initialReportState = { // duplicate ... move
                pdfDoc: null,
                currentPage: 1,
                pageCount: 0,
                zoom: 3,
            };

            ( async () => {

                let { id } = await getUserDetails();

                let resourcesResult = await AJAXCall({
                    phpFilePath: "../include/course/getResourcesForUser.php",
                    rejectMessage: "Running Query Failed",
                    params: `id=${id}`,
                    type: "fetch"
                });

                let reMapped = resourcesResult.map( course => {

                    let ebooks = [];

                    course.lectures.forEach( lectures => 
                        
                        lectures.resources.forEach( resource => 
                            resource.type == "application/pdf" ? ebooks.push({
                                title: resource.title,
                                value: resource.value
                            }) : false
                        )

                    )
                    
                    return {
                        title: course.title,
                        courseCode: course.courseCode,
                        ebooks
                    }
                })

                let ebooks = new Ebooks(reMapped);
                ebooks.renderEbooks();

                })();

                // Viewer

                async function renderPDFShot(canvasElementClass){

                initialReportState.pdfDoc
                .getPage(initialReportState.currentPage)
                .then((page) => {
                    const canvas = document.querySelector(canvasElementClass);
                    const ctx = canvas.getContext('2d');
                    const viewport = page.getViewport({
                        scale: initialReportState.zoom,
                    });

                    viewport.transform[4] -= 200;
                    viewport.transform[5] -= 200;

                    canvas.height = viewport.height / 2;
                    canvas.width = viewport.width / 2;

                    // Render the PDF page into the canvas context.
                    const renderCtx = {
                        canvasContext: ctx,
                        viewport: viewport,
                    };

                    page.render(renderCtx);
                });
                };

        </script>
    </body>
</html>