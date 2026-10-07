# 测试合成数据生成器的文件输出、数据范围和确定性。
from __future__ import annotations

import csv
import json
from pathlib import Path

import pytest

from quality_data.generator import SyntheticQualityGenerator


def read_batches(output_dir: Path) -> list[dict[str, str]]:
    """读取生成的 CSV 文件并返回字典列表。"""
    with (output_dir / "batches.csv").open("r", encoding="utf-8-sig", newline="") as file:
        return list(csv.DictReader(file))


def test_generate_creates_expected_files(tmp_path: Path) -> None:
    # 生成少量数据，检查目录、文件和计数是否一致。
    output_dir = tmp_path / "synthetic_demo"
    manifest = SyntheticQualityGenerator(output_dir, batch_count=10, seed=7).generate()

    assert (output_dir / "batches.csv").exists()
    assert (output_dir / "eval_questions.jsonl").exists()
    assert (output_dir / "manifest.json").exists()
    assert (output_dir / "knowledge" / "sop_dispensing.md").exists()
    assert manifest["is_synthetic"] is True
    assert manifest["batch_count"] == 10
    assert manifest["question_count"] == 30


def test_batch_count_and_yield_range(tmp_path: Path) -> None:
    # 检查 CSV 行数和模拟良率是否在合理范围。
    output_dir = tmp_path / "synthetic_demo"
    SyntheticQualityGenerator(output_dir, batch_count=25, seed=3).generate()
    rows = read_batches(output_dir)

    assert len(rows) == 25
    assert all(0 <= float(row["yield_rate"]) <= 1 for row in rows)
    assert all(row["data_source"] == "synthetic" for row in rows)


def test_same_seed_produces_same_csv(tmp_path: Path) -> None:
    # 相同 seed 应该生成同样的 CSV，保证实验可以复现。
    first_dir = tmp_path / "first"
    second_dir = tmp_path / "second"

    SyntheticQualityGenerator(first_dir, batch_count=12, seed=99).generate()
    SyntheticQualityGenerator(second_dir, batch_count=12, seed=99).generate()

    assert (first_dir / "batches.csv").read_text(encoding="utf-8-sig") == (
        second_dir / "batches.csv"
    ).read_text(encoding="utf-8-sig")


# parametrize 告诉 pytest：用下面的参数表重复执行这个测试。
@pytest.mark.parametrize(
    # 第一段声明两个参数名，要和测试函数的参数名对应。
    ("batch_count", "seed"),
    [
        (0, 1),       # 第一批：检查下界以下。
        (10001, 1),   # 第二批：检查上界以上。
        (1, -1),      # 第三批：检查负 seed。
    ],
)
def test_invalid_parameters_raise_value_error(
    tmp_path: Path,
    batch_count: int,
    seed: int,
) -> None:
    # 每一组参数都应该让生成器抛出 ValueError。
    with pytest.raises(ValueError):
        SyntheticQualityGenerator(
            tmp_path,
            batch_count=batch_count,
            seed=seed,
        )