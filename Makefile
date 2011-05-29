test:
	@expresso test/*

integration-test:
	@expresso integration-test/*
	@open integration-test/browser.test.html 

.PHONY: test integration-test
