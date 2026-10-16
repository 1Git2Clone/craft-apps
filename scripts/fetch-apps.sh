#!/bin/sh
# Fetches each app pinned in sites.json from its upstream storytold release
# into static/apps/<name>/, which the build then publishes as /apps/<name>/.
#
# Each zip is checked against its release's SHA256SUMS.txt before anything is
# unpacked. An app already at its pinned version is left alone, so re-running
# this locally only downloads what changed.
set -eu
cd "$(dirname "$0")/.."

node -e 'for (const [name, version] of Object.entries(require("./sites.json"))) console.log(name, version)' |
	while read -r name version; do
		dest=static/apps/$name
		if [ "$(cat "$dest/.version" 2>/dev/null)" = "$version" ]; then
			continue
		fi

		tmp=$(mktemp -d)
		base=https://github.com/storytold/$name/releases/download/v$version
		zip=$name-web-$version.zip
		(
			cd "$tmp"
			curl -fsSLO "$base/$zip"
			curl -fsSLO "$base/SHA256SUMS.txt"
			# The release must list this zip at all, or --ignore-missing below
			# would pass with nothing checked.
			grep -q " \*\?$zip\$" SHA256SUMS.txt
			sha256sum -c --ignore-missing --quiet SHA256SUMS.txt
			unzip -q "$zip"
		)

		rm -rf "$dest"
		mkdir -p static/apps
		mv "$tmp/$name-web-$version" "$dest"
		echo "$version" >"$dest/.version"
		rm -rf "$tmp"
		echo "fetched $name $version"
	done
