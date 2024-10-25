from pathlib import Path
from typing import Optional

import typer
from mat3ra.standata import Standata


def main(
    entity_config: str = typer.Argument(..., help="Location of entity config file."),
    destination: Optional[str] = typer.Option("--destination", "-d", help="Where to place symlink directory."),
):
    cfg_path = Path(entity_config)
    std = Standata.from_file(cfg_path)

    save_dir = cfg_path.parent
    if destination and Path(destination).resolve().exists():
        save_dir = Path(destination)
    categories_root = save_dir / "by_category"

    for entity in std.entities:
        categories = std.convert_tag_to_category(*entity["categories"])
        entity_path = std.entity_dir / entity["filename"]

        for category in categories:
            category_dir = categories_root / category
            category_dir.mkdir(parents=True, exist_ok=True)
            linked_entity = category_dir / entity["filename"]
            if not linked_entity.exists():
                linked_entity.symlink_to(entity_path)


def typer_app():
    typer.run(main)


if __name__ == "__main__":
    typer_app()
