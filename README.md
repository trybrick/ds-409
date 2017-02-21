# Coborns

This respository demonstrate Brick's bootstrap theme https://github.com/gsn/ds-bootstrap

## What is a Theme?
A Theme represent all Brick's engine pages templated by Brick, Inc.  This include: circular, coupon, recipe, article, etc...

To run this repository locally, you will need nodejs:  
```
npm install
```

And run with:

```
node serverApp.js 402
```

Then open your browser to: http://localhost:3402

## NOTE
'/asset/402' is your actual domain root.  Remember to put all your files and make changes inside of '/asset/402' only.  When the application run, files are copied from '/asset/402' to the root (/) folder; therefore, make sure you only modify files in '/asset/402' or your changes will be lost .

'/asset/retailerid' structure is Brick's convention to support multi-tenancy and allow retailer segmentation/direct access to the domain root.  When referencing asset (script, styles, images, etc..) inside of your html, we recommend retailers to use "/asset/retailerid" as your path prefix.

## GSN multi-tenancy benefits
* Support IE9 and below.  
* Backend pre-render SEO for SPA support.

Otherwise, you can run your site entirely from any static content hosting including GitHub.  Just create a 'gh-pages' branch from this repository and a .CNAME file.  Full instruction: https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages/
