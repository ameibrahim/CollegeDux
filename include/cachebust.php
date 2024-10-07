<?php
    function cachebust($file_url = false) {
        // if (!file_exists($file_url)) {
        //     return '10';
        // }

        // return filemtime($file_url);
        return time();
    }
?>
