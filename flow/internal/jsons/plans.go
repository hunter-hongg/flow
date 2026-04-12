package jsons

type Plan struct {
  Workflow string `json:"workflow"`
  Steps []Step `json:"steps"`
}

type Step struct {
  Name string `json:"name"`
  Exec string `json:"exec"`
	Deps []string `json:"deps"`
}
