REGISTRY = arvintian
PROJECT = claude-in-slack-api
GIT_VERSION = $(shell git rev-parse --short HEAD)

package:
	npm run build
	docker build -t $(REGISTRY)/$(PROJECT):$(GIT_VERSION) .

release: package
	docker tag $(REGISTRY)/$(PROJECT):$(GIT_VERSION) $(REGISTRY)/$(PROJECT):latest
	docker push $(REGISTRY)/$(PROJECT):$(GIT_VERSION)
	docker push $(REGISTRY)/$(PROJECT):latest

clean:
	rm -rf dist
	docker images | grep -E "$(REGISTRY)/$(PROJECT)" | grep -v "base"  | awk '{print $$3}' | uniq | xargs -I {} docker rmi --force {}