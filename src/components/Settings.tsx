import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import styles from "./Settings.module.scss"

type SettingKey = "slippage" | "custom"

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
  const [formData, setFormData] = useState<SettingValues>()
  form.watch((data) => {
    setFormData((current) => {
      if (
        Object.keys(data).filter((key) => {
          return (current as any)?.[key] !== (data as any)?.[key]
        }).length > 0
      ) {
        return data
      }
      return current
    })
  })

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
                  max={100}
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
      <div className={styles.caption}>Your transaction may fail.</div>
    </div>
  )
}

export default Settings
