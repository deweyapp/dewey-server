docker-run:
	@docker run -d \
		--name dewey-server \
		--pull \
		--publish 80:3000 \
		--log-driver=json-file \
		--log-opt max-size=10m \
		--log-opt max-file=10 \
		--restart=always \
		outcoldman/dewey-server:latest

docker-rm:
	@docker stop dewey-server
	@docker rm -v dewey-server
