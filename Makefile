#
# Some build-time scripts for programmer / development.
#

APPNAME=SafeBirth
VERSION=2.0.0

BUILDDIR=build
OUTDIR=output
SITEDIR=SA-site


NODE_BIN=./node_modules/.bin
WEBPACK=$(NODE_BIN)/webpack
BABELNODE=$(NODE_BIN)/babel-node
HTMLPDF=$(NODE_BIN)/html-pdf

STAMP=$(shell ./bin/stamp.sh)
F=${STAMP}

.PHONY: build copysrc zip genkey_android webpack watch test report translationStrings reports

build: phonegap

test:
	npm test

webpack:
	rm -rf dist
	VERSION=$(VERSION) $(WEBPACK)
watch:
	VERSION=$(VERSION) $(WEBPACK) --watch

copysrc: webpack
	@rm -rf $(BUILDDIR)
	mkdir $(BUILDDIR)
	cp -r dist $(BUILDDIR)/www
	cp -r  config.xml ./resources/icons ./resources/splash $(BUILDDIR)
	perl -pi -e 's/"VERSIONCODE"/"$(VERSIONCODE)"/g' $(BUILDDIR)/config.xml
	perl -pi -e 's/"VERSION"/"$(VERSION)"/g' $(BUILDDIR)/config.xml
zip: copysrc
	(cd $(BUILDDIR); zip -r $(APPNAME).zip -x@../bin/exclude.lst config.xml icons splash www)
	mkdir -p $(OUTDIR)
	cp $(BUILDDIR)/$(APPNAME).zip $(OUTDIR)/$(APPNAME)-${F}.zip

phonegap: zip
	(cd $(OUTDIR); node ../phonegap.js config.xml $(APPNAME)-${F})


site: copysrc
	rm -rf $(SITEDIR)
	mkdir -p $(SITEDIR)
	cp -r $(BUILDDIR)/www $(SITEDIR)
	cp preview.html preview.css $(SITEDIR)

pdf:
	mkdir -p pdftmp
	@$(eval F := $(shell ./bin/stamp.sh))
	pdfunite `node ./bin/make_pdf.js ${F}` $(APPNAME)-${F}.pdf
clean:
	rm -f $(APPNAME)-*
	rm -rf pdftmp ${BUILDDIR}

report:
	mkdir -p reports
	$(BABELNODE) bin/makeReport.js > reports/report.html
	cp bin/report.css reports/report.css
	$(HTMLPDF) reports/report.html reports/report.pdf

reports: report translationStrings

