from __future__ import annotations

import csv
from pathlib import Path


def load_rows(path: Path) -> list[dict[str, str]]:
    """读取 CSV，并返回字典列表。"""
    with path.open("r", encoding="utf-8-sig", newline="") as file:
        # DictReader 会把第一行表头作为字典键。
        return list(csv.DictReader(file))


def predict_anomaly(row: dict[str, str]) -> bool:
    """只使用参数预测是否为点胶不良。"""
    # 特征一：温度。
    temperature = float(row["temperature_c"])

    # 特征二：点胶量。
    dispense = float(row["dispense_mg"])

    # 两个阈值同时满足时，预测为异常。
    return temperature >= 26.0 and dispense >= 13.0


def main() -> None:
    """运行规则检测，并和真实标签比较。"""
    path = Path("data/anomaly_interval_10/batches.csv")
    rows = load_rows(path)

    # 四个计数用于评估检测结果。
    true_positive = 0
    false_positive = 0
    true_negative = 0
    false_negative = 0

    for row in rows:
        # 真实标签：CSV 中预先记录的答案。
        actual = row["defect_type"] == "点胶不良"

        # 预测结果：只看温度和点胶量。
        predicted = predict_anomaly(row)

        if actual and predicted:
            true_positive += 1
        elif not actual and predicted:
            false_positive += 1
        elif not actual and not predicted:
            true_negative += 1
        else:
            false_negative += 1

    total = len(rows)
    accuracy = (true_positive + true_negative) / total

    print(f"TP 实际异常且预测异常：{true_positive}")
    print(f"FP 实际正常但预测异常：{false_positive}")
    print(f"TN 实际正常且预测正常：{true_negative}")
    print(f"FN 实际异常但预测正常：{false_negative}")
    print(f"准确率：{accuracy:.2%}")


if __name__ == "__main__":
    # 直接运行本文件时执行检测。
    main()
