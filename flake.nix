{
  description = "Development shell for crafts.hu-tao.dev";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { nixpkgs, ... }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
      ];

      forAllSystems = fn: nixpkgs.lib.genAttrs systems (system: fn nixpkgs.legacyPackages.${system});
    in
    {
      devShells = forAllSystems (pkgs: {
        # Matches package.json's engines and the workflow's node:26 image, so the version that
        # builds here is the version the runner builds with.
        default = pkgs.mkShell {
          packages = [
            pkgs.nodejs_26
            pkgs.pnpm
            # scripts/fetch-apps.sh
            pkgs.curl
            pkgs.unzip
          ];
        };
      });
    };
}
