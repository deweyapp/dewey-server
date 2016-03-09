docker-run:
	@docker pull outcoldman/dewey-server:latest
	@docker run -d \
		--name dewey-server \
		--publish 80:3000 \
		--log-driver=json-file \
		--log-opt max-size=1m \
		--log-opt max-file=1000 \
		--restart=always \
		--env NODE_ENV=production \
		--memory 250M \
		outcoldman/dewey-server:latest

docker-rm:
	@docker stop dewey-server
	@docker rm -v dewey-server
