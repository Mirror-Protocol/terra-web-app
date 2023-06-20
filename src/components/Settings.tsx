import React, { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import styles from "./Settings.module.scss"
import classNames from "classnames/bind"

type SettingKey = "slippage" | "custom" | "txDeadline"

export type SettingValues = {
  [K in SettingKey]: string
}

type SettingsProps = {
  values?: SettingValues
  onChange?: (settings: SettingValues) => void
}
const Settings = ({ values, onChange }: SettingsProps) => {
  const form = useForm<SettingValues>({
    defaultValues: values,
    mode: "onChange",
  })
  const isDangerous = useMemo(() => {
    if (values?.slippage === "custom") {
      if (parseFloat(`${values?.custom}`) < 0.5) {
        return true
      }
      return false
    }
    if (parseFloat(`${values?.slippage}`) < 0.5) {
      return true
    }
  }, [values])
  const [formData, setFormData] = useState<SettingValues>()
  form.watch((data) => {
    setFormData((current) => {
      if (
        Object.keys(data).filter((key) => {
          return (current as any)?.[key] !== (data as any)?.[key]
        }).length > 0
      ) {
        return data as SettingValues
      }
      return current
    })
  })
  const [inputFocused, setInputFocused] = useState(false)

  useEffect(() => {
    formData && onChange && onChange(formData)
  }, [formData, onChange])

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Slippage Tolerance</div>
      <div className={styles["radio-group"]}>
        {["0.1", "0.5", "1", "custom"].map((value) => (
          <label key={value} className={styles["radio-group__item"]}>
            <input type="radio" value={value} {...form.register("slippage")} />
            <div>
              {value === "custom" ? (
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  onFocus={() => {
                    form.setValue("slippage", "custom")
                  }}
                  {...form.register("custom")}
                />
              ) : (
                value
              )}
              %
            </div>
          </label>
        ))}
      </div>
      {isDangerous && (
        <div className={styles.caption}>Your transaction may fail.</div>
      )}
      <div className={styles.title}>Transaction Deadline</div>
      <div
        className={
          inputFocused
            ? classNames(styles["text-input"], styles["focused"])
            : styles["text-input"]
        }
      >
        <input
          type="number"
          min={0}
          placeholder="20"
          {...form.register("txDeadline")}
          onFocus={() => {
            setInputFocused(true)
          }}
          onBlur={() => {
            setInputFocused(false)
          }}
        />{" "}
        min
      </div>
    </div>
  )
}

export default Settings
