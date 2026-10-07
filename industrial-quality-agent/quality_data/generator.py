# 工业质量合成数据生成器。
# 这个模块只生成模拟数据，不包含任何公司真实数据。

from __future__ import annotations

import csv
import json
import random
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any


class SyntheticQualityGenerator:
    """生成可复现的制造质量合成数据集。"""

    def __init__(self, output_dir: Path, batch_count: int = 120, seed: int = 42) -> None:
        # 对输入参数做边界检查，避免生成空数据或异常大的文件。
        if batch_count < 1 or batch_count > 10000:
            raise ValueError("batch_count 必须在 1 到 10000 之间")
        if seed < 0:
            raise ValueError("seed 必须是非负整数")

        self.output_dir = Path(output_dir)
        self.batch_count = batch_count
        self.seed = seed
        # 使用独立随机数生成器，保证相同 seed 得到相同结果。
        self.rng = random.Random(seed)

    def generate(self) -> dict[str, Any]:
        """生成批次数据、知识文档、评测问题和 manifest。"""
        self._create_directories()
        batches = self._generate_batches()
        documents = self._build_knowledge_documents()
        questions = self._build_eval_questions()

        self._write_batches(batches)
        self._write_documents(documents)
        self._write_questions(questions)

        manifest = {
            "dataset_name": "industrial-quality-synthetic-demo",
            "dataset_version": "0.1.0",
            "is_synthetic": True,
            "seed": self.seed,
            "batch_count": len(batches),
            "document_count": len(documents),
            "question_count": len(questions),
            "files": [
                "batches.csv",
                "eval_questions.jsonl",
                "knowledge/",
                "manifest.json",
                "README.md",
            ],
            "notice": "仅用于学习和演示，不得用于真实生产决策。",
        }
        self._write_json(self.output_dir / "manifest.json", manifest)
        self._write_dataset_readme(manifest)
        return manifest

    def _create_directories(self) -> None:
        """创建输出目录和知识库子目录。"""
        (self.output_dir / "knowledge").mkdir(parents=True, exist_ok=True)

    def _generate_batches(self) -> list[dict[str, Any]]:
        """生成模拟批次记录，并在固定间隔注入异常。"""
        rows: list[dict[str, Any]] = []
        products = ["光学模组-A", "光学模组-B", "传感器-C"]
        steps = ["点胶", "清洗", "厚度检测", "外观检查"]
        equipment_ids = ["EQ-01", "EQ-02", "EQ-03", "EQ-04"]
        shifts = ["白班", "夜班"]
        normal_defects = ["正常", "轻微脏污", "轻微划伤"]
        base_time = datetime(2026, 1, 1, 8, 0, 0)

        for index in range(1, self.batch_count + 1):
            anomaly = index % 10 == 0
            defect_type = "点胶不良" if anomaly else self.rng.choice(normal_defects)
            defect_count = self.rng.randint(4, 9) if anomaly else self.rng.randint(0, 2)

            process_step = "点胶" if anomaly else self.rng.choice(steps)
            temperature = 25.0 + self.rng.uniform(-1.0, 1.0)
            pressure = 101.0 + self.rng.uniform(-2.0, 2.0)
            dispense = 12.0 + self.rng.uniform(-0.8, 0.8)
            thickness = 250.0 + self.rng.uniform(-8.0, 8.0)

            if anomaly:
                # 让异常批次同时偏离温度和点胶量，方便后续异常分析。
                temperature += self.rng.uniform(1.5, 3.0)
                dispense += self.rng.uniform(2.0, 4.0)

            yield_rate = 0.995 - defect_count * 0.012 - self.rng.uniform(0.0, 0.008)
            yield_rate = round(max(0.70, min(0.999, yield_rate)), 4)
            started_at = base_time + timedelta(hours=(index - 1) * 8)

            rows.append(
                {
                    "batch_id": f"B20261004-{index:04d}",
                    "product": self.rng.choice(products),
                    "process_step": process_step,
                    "equipment_id": self.rng.choice(equipment_ids),
                    "started_at": started_at.isoformat(),
                    "shift": self.rng.choice(shifts),
                    "temperature_c": round(temperature, 2),
                    "pressure_kpa": round(pressure, 2),
                    "dispense_mg": round(dispense, 2),
                    "thickness_um": round(thickness, 2),
                    "defect_type": defect_type,
                    "defect_count": defect_count,
                    "yield_rate": yield_rate,
                    "data_source": "synthetic",
                }
            )
        return rows

    def _build_knowledge_documents(self) -> dict[str, str]:
        """构造模拟 SOP、案例和 FMEA 文档。"""
        notice = "> 本文档为合成演示内容，不来自任何公司，不可用于真实生产决策。\n\n"
        return {
            "sop_cleaning.md": notice + "# 清洗作业指导书\n\n检查喷嘴、清洗液液位和设备状态，记录异常并通知设备负责人。\n",
            "sop_dispensing.md": notice + "# 点胶作业指导书\n\n确认胶量、压力、温度和点胶路径，首件确认通过后再批量生产。\n",
            "case_dirty_nozzle.md": notice + "# 8D 案例：喷嘴脏污\n\n现象：局部点胶不均。根因：喷嘴残留物导致出胶受阻。措施：清洁喷嘴并增加首件检查。\n",
            "fmea_dispensing.md": notice + "# FMEA：点胶工序\n\n失效模式：胶量偏多。可能原因：压力漂移、胶筒温度异常。建议：监控压力并设置报警阈值。\n",
        }

    def _build_eval_questions(self) -> list[dict[str, Any]]:
        """生成用于 RAG 检索的最小评测问题集。"""
        templates = [
            ("点胶不良应该先检查什么？", ["sop_dispensing.md", "case_dirty_nozzle.md"], "故障排查"),
            ("喷嘴脏污的可能原因是什么？", ["case_dirty_nozzle.md"], "原因分析"),
            ("温度异常可能带来什么质量风险？", ["fmea_dispensing.md"], "风险评估"),
            ("发现胶量偏多时应该查看哪些参数？", ["sop_dispensing.md", "fmea_dispensing.md"], "数据分析"),
            ("如何写一个点胶异常的 8D 草稿？", ["case_dirty_nozzle.md", "fmea_dispensing.md"], "报告生成"),
        ]
        questions: list[dict[str, Any]] = []
        for index in range(1, 31):
            prompt, doc_ids, category = templates[(index - 1) % len(templates)]
            questions.append(
                {
                    "question_id": f"Q{index:03d}",
                    "question": prompt,
                    "expected_doc_ids": doc_ids,
                    "category": category,
                    "difficulty": "easy" if index % 3 else "medium",
                }
            )
        return questions

    def _write_batches(self, batches: list[dict[str, Any]]) -> None:
        """把批次记录写入 CSV。"""
        path = self.output_dir / "batches.csv"
        with path.open("w", encoding="utf-8-sig", newline="") as file:
            writer = csv.DictWriter(file, fieldnames=list(batches[0].keys()))
            writer.writeheader()
            writer.writerows(batches)

    def _write_documents(self, documents: dict[str, str]) -> None:
        """把模拟知识文档写入 knowledge 目录。"""
        for filename, content in documents.items():
            (self.output_dir / "knowledge" / filename).write_text(content, encoding="utf-8")

    def _write_questions(self, questions: list[dict[str, Any]]) -> None:
        """把评测问题写成 JSONL，每行一条记录。"""
        path = self.output_dir / "eval_questions.jsonl"
        lines = [json.dumps(item, ensure_ascii=False) for item in questions]
        path.write_text("\n".join(lines) + "\n", encoding="utf-8")

    def _write_json(self, path: Path, data: dict[str, Any]) -> None:
        """把字典写成格式化 JSON 文件。"""
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    def _write_dataset_readme(self, manifest: dict[str, Any]) -> None:
        """写出数据集使用说明。"""
        content = f"""# 合成工业质量数据

> 仅用于学习和演示，不得用于真实生产决策。

- 数据源：Python 合成数据
- 随机种子：{manifest['seed']}
- 批次数：{manifest['batch_count']}
- 文档数：{manifest['document_count']}
- 评测问题数：{manifest['question_count']}
- 所有记录均带有 `data_source=synthetic` 标记。
"""
        (self.output_dir / "README.md").write_text(content, encoding="utf-8")
