
COFFEEFILES =$(shell find src -name '*.coffee')
JSFILES :=  $(COFFEEFILES:.coffee=.js)

MDFILES = $(shell find doc -name '*.md')
HTMLFILES := $(MDFILES:.md=.html)

TESTS := $(shell find src/tests -name test.*.js)

#rules
%.js: %.coffee
	@echo compile $<  to $@
	coffee -b -c $< 
%.html: %.md
	@echo gen doc from $< to $@
	@md2html $<  >$@


help:
	@echo "help"
	@echo "make js -- 编译coffee到js" 
	@echo "make doc -- 生成文档" 
	@echo "make test -- 跑测试" 
	@echo "COFFEEFILES:" $(COFFEEFILES)
	@echo "MDFILES:" $(MDFILES)

js: $(JSFILES)

doc: $(MDFILES) $(HTMLFILES) 
	@echo $@ $<

jsdoc:
	@./tools/jsdoc.sh
	

test: 
	NODE_ENV=test mocha \
		--require should \
		--reporter spec \
		$(TESTS)
